const Router = require('express').Router()
const CarbonCalculate = require('../controllers/carbonCalculateCtrl')

Router.get("/getCCBank",CarbonCalculate.getCCbank)
Router.get("/publicGetCCBank",CarbonCalculate.publicGetCCbank)
Router.get("/getVehicle",CarbonCalculate.getVehicle)
Router.get("/getAllCarbonFoodList",CarbonCalculate.getAllCarbonFoodList)

Router.post("/addCarbonFood",CarbonCalculate.addCarbonFood)
Router.post("/authAPI",CarbonCalculate.authCarbonInterfaceApi)
Router.post("/calVehicle",CarbonCalculate.calculateVehicle)
Router.post("/calFood",CarbonCalculate.calculateFood)
Router.post("/purchase",CarbonCalculate.purchaseOffset)
Router.post("/downloadCertificate", CarbonCalculate.downloadCertificate)
Router.post("/publicCalVehicle", CarbonCalculate.publicCalculateVehicle)
Router.post("/publicCalFood", CarbonCalculate.publicCalculateFood)
Router.post("/publicGetAllCarbinFoodList", CarbonCalculate.publicGetAllCarbonFoodList)
Router.post("/publicGetVehicle", CarbonCalculate.publicGetVehicle)

module.exports = Router