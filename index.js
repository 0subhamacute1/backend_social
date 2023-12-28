
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");


const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/social",(req,res)=>{
    res.send("hello world")
})

app.use("/social/user",require("./route/user"))




mongoose.connect(process.env.DB_URL).then(() => {
  console.log("db connected");
});

app.listen(5000, () => {
  console.log("5000 running");
});
