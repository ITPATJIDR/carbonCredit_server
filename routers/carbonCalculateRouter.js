const Router = require('express').Router()
const CarbonCalculate = require('../controllers/carbonCalculateCtrl')

Router.post("/addCarbonFood",CarbonCalculate.addCarbonFood)
Router.get("/getAllCarbonFoodList",CarbonCalculate.getAllCarbonFoodList)

module.exports = Router