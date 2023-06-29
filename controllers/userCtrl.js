const userCtrl = {
	register: async (req, res) => {
		try{

		}catch(err){
			res.status(200).json({status:500,message:"Internal Server Error"})
		}
	}
}

module.exports = userCtrl