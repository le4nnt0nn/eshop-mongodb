const express = require("express");
const app = express();

require("dotenv/config");

const api = process.env.API_URL;

app.get(api+"/products", (req, res)=>{
    res.send("hello API !");
})

app.listen(3003, ()=>{
    console.log(api);
    console.log("server is running http://localhost:3003");
})