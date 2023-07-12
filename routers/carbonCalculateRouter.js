const Router = require('express').Router()
const CarbonCalculate = require('../controllers/carbonCalculateCtrl')

Router.post("/addCarbonFood",CarbonCalculate.addCarbonFood)
Router.get("/getAllCarbonFoodList",CarbonCalculate.getAllCarbonFoodList)
Router.post("/authAPI",CarbonCalculate.authCarbonInterfaceApi)
Router.get("/getVehicle",CarbonCalculate.getVehicle)

module.exports = Router