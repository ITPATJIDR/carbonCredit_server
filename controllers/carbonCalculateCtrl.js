const connection = require('../utils/database')
const axios = require("axios")

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
				
		}catch(err){
			res.status(200).json({ status: 500, message: "Internal Server Error" });
		}
	}
}

module.exports = CarbonCalculate
