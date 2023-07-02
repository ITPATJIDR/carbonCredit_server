const express = require('express');
const app = express();
const cors = require('cors');
const cookieparser = require('cookie-parser');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
dotenv.config()
const PORT = process.env.PORT || 5001

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors({origin: ["http://localhost:3000"],credentials:true}))
app.use(cookieparser())
app.use(fileUpload({
  createParentPath:true,
  limits:{
    fileSize: 2 * 1024 * 1024 * 1024,
  }
}))


app.use("/user",require("./routers/userRouter"))

app.use("/certificates", express.static("certificates"))
app.use("/uploads", express.static("uploads"))

app.get("/", (req, res) => {
  res.send("I'm alive...")
})

app.listen(PORT, (req, res) => {
  console.log(`Server is runing on Port: ${PORT}`);
});
