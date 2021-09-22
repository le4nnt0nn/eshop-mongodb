const express = require("express");
const app = express();

app.get("/", (req, res)=>{
    res.send("hello API !");
})

app.listen(3003, ()=>{
    console.log("server is running http://localhost:3003");
})