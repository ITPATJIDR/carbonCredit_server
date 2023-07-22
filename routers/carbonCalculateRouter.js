const Router = require('express').Router()
const CarbonCalculate = require('../controllers/carbonCalculateCtrl')

Router.post("/addCarbonFood",CarbonCalculate.addCarbonFood)
Router.get("/getAllCarbonFoodList",CarbonCalculate.getAllCarbonFoodList)
Router.post("/authAPI",CarbonCalculate.authCarbonInterfaceApi)
Router.get("/getVehicle",CarbonCalculate.getVehicle)
Router.post("/calVehicle",CarbonCalculate.calculateVehicle)
Router.post("/purchase",CarbonCalculate.purchaseOffset)
Router.post("/downloadCertificate", CarbonCalculate.downloadCertificate)

module.exports = Router