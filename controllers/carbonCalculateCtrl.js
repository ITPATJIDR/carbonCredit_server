const Template_1 = require('../templates/templates_1')
const connection = require('../utils/database')
const axios = require("axios")
const fs = require('fs');
const pdfMake = require('pdfmake');
const { genNumber, refreshTokenVerify, convertCoinToTree } = require('../utils/encode');

const headers = {
	Authorization: `Bearer ${process.env.CC_KEY}`
}

const CarbonCalculate = {
	addCarbonFood: async (req, res) => {
		try {

			const { name, amount } = req.body
			const addCardonFood_sql = "INSERT INTO cc_list (cc_name, cc_amount) VALUES (?,?)"
			const addCardonFood_data = [name, amount]

			await connection.query(addCardonFood_sql, addCardonFood_data, (err, result) => {
				if (err) {
					res.status(200).json({ status: 400, message: "Something wrong" })
				} else {
					res.status(200).json({ status: 200, message: "Add Cardon Food Success" })
				}
			})
		} catch (err) {
			res.status(200).json({ status: 500, message: "Internal Server Error" })
		}
	},
	getAllCarbonFoodList: async (req, res) => {
		try {
			const getAllCarbonFoodList_sql = "SELECT * FROM cc_list"
			await connection.query(getAllCarbonFoodList_sql, (err, result) => {
				if (err) {
					console.log(err)
					res.status(200).json({ status: 400, message: "Something wrong" })
				} else {
					res.status(200).json({ status: 400, result: result })
				}
			})
		} catch (err) {
			res.status(200).json({ status: 500, message: "Internal Server Error" })
		}
	},
	authCarbonInterfaceApi: async (req, res) => {
		try {
			const auth = await axios.get("https://www.carboninterface.com/api/v1/auth", {
				headers: {
					Authorization: `Bearer ${process.env.CC_KEY}`
				}
			})
			if (auth.status === 200) {
				res.status(200).json({ status: 200, message: "Auth API Success" })
			} else {
				res.status(200).json({ status: 400, message: "Auth APU Failed" })
			}
		} catch (err) {
			res.status(200).json({ status: 500, message: "Internal Server Error" })
		}
	},
	getVehicle: async (req, res) => {
		try {
			const response = await axios.get(
				"https://www.carboninterface.com/api/v1/vehicle_makes",
				{
					headers: {
						Authorization: `Bearer ${process.env.CC_KEY}`,
						"Content-Type": "application/json",
					},
				}
			);

			const vehicleData = response.data; 

			res.status(200).json({ status: 200, vehicleData });
		} catch (err) {
			console.log(err);
			res.status(200).json({ status: 500, message: "Internal Server Error" });
		}
	},
	calculateVehicle: async ( req,res) => {
		try{
			const { distance_value, vehicle_model_id } = req.body
			const getVehicleModel = await axios.get(`https://www.carboninterface.com/api/v1/vehicle_makes/${vehicle_model_id}/vehicle_models`,
				{
					headers: {
						Authorization: `Bearer ${process.env.CC_KEY}`,
						"Content-Type": "application/json",
					},
				}
			)
			const vehicleId = getVehicleModel.data[0].data.id
			
			const resultCal = await axios.post("https://www.carboninterface.com/api/v1/estimates",
				{
					"type": "vehicle",
					"distance_unit": "km",
					"distance_value": distance_value,
					"vehicle_model_id": vehicleId
				},
				{
					headers: {
						Authorization: `Bearer ${process.env.CC_KEY}`,
						"Content-Type": "application/json",
					},
				})
			res.status(200).json({ status: 200, data: resultCal.data});
		}catch(err){
			console.log(err)
			res.status(200).json({ status: 500, message: "Internal Server Error" });
		}
	},
	calculateFood: async (req,res) =>{
		try{
			const { food_amt, food_carbon } = req.body
			total = (food_amt * food_carbon).toFixed(2);
			
			res.status(200).json({ status: 200, data: total});
		}catch(err){
			res.status(200).json({ status: 500, message: "Internal Server Error" });
		}
	},
	purchaseOffset: async (req,res) =>{
		try{
			const { offset, id } = req.body
			const getUser_sql = "SELECT * from users WHERE id = ?"
			const getUser_data = [id]
			const fonts = {
				Roboto: {
					normal: 'assets/fonts/Roboto-Regular.ttf',
				},
				Anastasia:{
					normal: "assets/fonts/Anastasia.ttf"
				},
				Poppins:{
					normal: "assets/fonts/Poppins-Thin.ttf"
				}
				
			}
			await connection.query(getUser_sql, getUser_data, async (err, result) => {
				if(err){
					res.status(200).json({ status: 400, message: "Purchase Failed" });
				}else{
					const {compensate_CC, growth_a_tree, name, surname, coin} = result[0]
					const fullname = name + " " + surname
					//cal part
					const new_coin = Math.ceil(Number(coin) + Number(offset))
					const new_compensate_CC = Math.ceil(Number(compensate_CC) + Number(offset))
					const new_growth_a_tree = Number(new_compensate_CC) / 12)

					const new_tree = convertCoinToTree(new_coin)
					const newData = {
						compensate_CC: new_compensate_CC,
						growth_a_tree: new_growth_a_tree,
						coin : new_coin
					}
					const getCCbank_sql = "SELECT * FROM cc_bank WHERE id = 1"
					await connection.query(getCCbank_sql, async (err , ccBank) => {
						if(err) {
							res.status(200).json({ status: 400, message: "Purchase Failed" });
						}
						const { cc_main_credit, compensate_CC_main, growth_a_tree_main} = ccBank[0]

						//cal part
						const new_cc_main_credit = Math.ceil(cc_main_credit - Number(offset))
						const new_compensate_CC_main = Math.ceil(compensate_CC_main + Number(offset))
						const new_growth_a_tree_main = Number(new_compensate_CC_main) / 12

						const newData_CCbank = {
							cc_main_credit: new_cc_main_credit,
							compensate_CC_main: new_compensate_CC_main,
							growth_a_tree_main: new_growth_a_tree_main
						}

						const updateCCBank_sql = "UPDATE cc_bank SET ? WHERE id = 1"
						const updateCCBank_data = [newData_CCbank]
						await connection.query(updateCCBank_sql,updateCCBank_data,(err) => {
							if (err) {
								console.log(err)
								res.status(200).json({ status: 400, message: "Purchase Failed" });
							}
						})
						const updatePurchase_sql = "UPDATE users SET ? WHERE id = ?"
						const updatePurchase_data = [newData, id]
						await connection.query(updatePurchase_sql, updatePurchase_data, async (err, result) => {
							if (err) {
								res.status(200).json({ status: 400, message: "Purchase Failed" });
							} else {
								const preCreateCertificate = Template_1(fullname, Number(offset), new_tree)
								const printer = new pdfMake(fonts)
								const pdfDoc = printer.createPdfKitDocument(preCreateCertificate)
								const fileName = await "CC_" + genNumber()
								const filePath = `certificates/${fileName}.pdf`
								const writeStream = fs.createWriteStream(filePath);
								const createCertificate_sql = "INSERT INTO certificate_list (userId, cert_path) VALUES (?, ?) "
								const createCertificate_data = [id, filePath]
								await connection.query(createCertificate_sql, createCertificate_data, (err, result) => {
									if (err) {
										res.status(200).json({ status: 200, message: "Purchase Success" });
									}
								})
								pdfDoc.pipe(writeStream);
								pdfDoc.end();
								res.status(200).json({ status: 200, message: "Purchase Success" });
							}
						})
					})
				}
			})
		}catch(err){
			res.status(200).json({ status: 500, message: "Internal Server Error" });
		}
	},
	getCCbank: async (req,res) =>{
		try{
			const getCCbank_sql = "SELECT * FROM cc_bank WHERE id = 1"
			await connection.query(getCCbank_sql, async (err, ccBank) => {
				if(err){
					res.status(200).json({ status: 500, message: "Internal Server Error" });
				}else{
					res.status(200).json({ status: 200, data: ccBank});
				}
			})
		}catch(err){
			res.status(200).json({ status: 500, message: "Internal Server Error" });
		}
	},
	downloadCertificate: async (req, res) => {
		try{
			const {cert_path} = req.body
			const fileName = cert_path.split("/")
			res.download(cert_path, fileName[1], (err) => { 
					if(err){
					console.log('Error downloading file:', err.message);
				}
			})
		}catch(err){
			res.status(200).json({ status: 500, message: "Internal Server Error" });
		}
	},
	publicCalculateVehicle: async ( req,res) => {
		try{
			const { distance_value, vehicle_model_id, api_key } = req.body

			if(await refreshTokenVerify(api_key)){
				const getVehicleModel = await axios.get(`https://www.carboninterface.com/api/v1/vehicle_makes/${vehicle_model_id}/vehicle_models`,
					{
						headers: {
							Authorization: `Bearer ${process.env.CC_KEY}`,
							"Content-Type": "application/json",
						},
					}
				)
				const vehicleId = getVehicleModel.data[0].data.id

				const resultCal = await axios.post("https://www.carboninterface.com/api/v1/estimates",
					{
						"type": "vehicle",
						"distance_unit": "km",
						"distance_value": distance_value,
						"vehicle_model_id": vehicleId
					},
					{
						headers: {
							Authorization: `Bearer ${process.env.CC_KEY}`,
							"Content-Type": "application/json",
						},
					})

				res.status(200).json({ status: 200, data: resultCal.data });
			}else{
				res.status(200).json({ status: 403, message: "Invaild Api Key" });
			}
		}catch(err){
			console.log(err)
			res.status(200).json({ status: 500, message: "Internal Server Error" });
		}
	},
	publicCalculateFood: async (req,res) =>{
		try{
			const { food_amt, food_carbon, api_key } = req.body
			if(await refreshTokenVerify(api_key)){
				const total = (food_amt * food_carbon).toFixed(2);
				res.status(200).json({ status: 200, data: total});
			}else{
				res.status(200).json({ status: 403, message:"Invalid Api Key" });
			}
		}catch(err){
			res.status(200).json({ status: 500, message: "Internal Server Error" });
		}
	},
	publicGetAllCarbonFoodList: async (req, res) => {
		try {
			const { api_key } = req.body
			if(await refreshTokenVerify(api_key)){
				const getAllCarbonFoodList_sql = "SELECT * FROM cc_list"
				await connection.query(getAllCarbonFoodList_sql, (err, result) => {
					if (err) {
						console.log(err)
						res.status(200).json({ status: 400, message: "Something wrong" })
					} else {
						res.status(200).json({ status: 400, result: result })
					}
				})
			}else{
				res.status(200).json({ status: 403, message:"Invalid Api Key" });
			}
		} catch (err) {
			res.status(200).json({ status: 500, message: "Internal Server Error" })
		}
	},
	publicGetVehicle: async (req, res) => {
		try {
			const { api_key } = req.body
			if(await refreshTokenVerify(api_key)){
				const response = await axios.get(
					"https://www.carboninterface.com/api/v1/vehicle_makes",
					{
						headers: {
							Authorization: `Bearer ${process.env.CC_KEY}`,
							"Content-Type": "application/json",
						},
					}
				);

				const vehicleData = response.data;

				res.status(200).json({ status: 200, vehicleData });
			}else{
				res.status(200).json({ status: 403, message:"Invalid Api Key" });
			}
		} catch (err) {
			console.log(err);
			res.status(200).json({ status: 500, message: "Internal Server Error" });
		}
	},
	publicGetCCbank: async (req,res) =>{
		try{
			const {api_key} = req.body
			if(await refreshTokenVerify(api_key)){
				const getCCbank_sql = "SELECT * FROM cc_bank WHERE id = 1"
				await connection.query(getCCbank_sql, async (err, ccBank) => {
					if (err) {
						res.status(200).json({ status: 500, message: "Internal Server Error" });
					} else {
						res.status(200).json({ status: 200, data: ccBank });
					}
				})
			}else{
				res.status(200).json({ status: 403, message: "Invalid Api key" });
			}
		}catch(err){

			res.status(200).json({ status: 500, message: "Internal Server Error" });
		}
	},
}

module.exports = CarbonCalculate