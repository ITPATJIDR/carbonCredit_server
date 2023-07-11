const connection = require('../utils/database')

const CarbonCalculate = {
	addCarbonFood: async (req,res) => {
		try{

		const {name,amount} = req.body
		const addCardonFood_sql = "INSERT INTO cc_list (cc_name, cc_amount) VALUES (?,?)"
		const addCardonFood_data = [name, amount]

		await connection.query(addCardonFood_sql, addCardonFood_data, (err, result) => {
			if(err){
				res.status(200).json({status:400,message:"Something wrong"})
			}else{
				res.status(200).json({status:200,message:"Add Cardon Food Success"})
			}
		})
		}catch(err){
			res.status(200).json({status:500,message:"Internal Server Error"})
		}
	},
	getAllCarbonFoodList:  async (req,res) =>{
		try{
			const getAllCarbonFoodList_sql = "SELECT * FROM cc_list"
			await connection.query(getAllCarbonFoodList_sql,(err,result) =>{
				if(err){
					res.status(200).json({ status: 400, message: "Something wrong" })
				}else{
					res.status(200).json({ status: 400, result: result })
				}
			})
		}catch(err){
			res.status(200).json({ status: 500, message: "Internal Server Error" })
		}
	},
}

module.exports = CarbonCalculate
