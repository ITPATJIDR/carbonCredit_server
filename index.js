const express = require('express');
const app = express();
const cors = require('cors');
const cookieparser = require('cookie-parser');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
dotenv.config()
const PORT = process.env.PORT || 5001

app.use(express.urlencoded({extended:true}))
app.use(express.json())
const allowedOrigins = ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://localhost:3000', 'https://greenie-app.azurewebsites.net'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Allow sending cookies with the request
}));
app.use(cookieparser())
app.use(fileUpload({
  createParentPath:true,
  limits:{
    fileSize: 2 * 1024 * 1024 * 1024,
  }
}))


app.use("/user",require("./routers/userRouter"))
app.use("/carbon",require("./routers/carbonCalculateRouter"))

app.use("/certificates", express.static("certificates"))
app.use("/uploads", express.static("uploads"))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});

app.get("/", (req, res) => {
  res.send("I'm Greenie...")
})

app.listen(PORT, (req, res) => {
  console.log(`Server is runing on Port: ${PORT}`);
});
