const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const cookieparser = require('cookie-parser')

app.use("/",(req,res) =>{
	res.send("Hi")
})

app.listen("5000",(req, res) => {
	console.log("Server is running on port 5000")
})