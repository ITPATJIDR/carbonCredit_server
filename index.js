const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const cookieparser = require('cookie-parser')
dotenv.config()

app.use(cors())
app.use(cookieparser())

app.use("/user",require("./routers/userRouter"))

app.use("/",(req,res) =>{
	res.send("Hi")
})

app.listen("5000",(req, res) => {
	console.log("Server is running on port 5000")
})