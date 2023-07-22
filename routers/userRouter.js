const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')

router.post("/register",userCtrl.register)
router.post("/login",userCtrl.login)
router.post("/logout",userCtrl.logout)
router.get("/getRefreshToken",userCtrl.getRefreshToken)
router.post("/updateProfile",userCtrl.updateProfile)


module.exports = router

