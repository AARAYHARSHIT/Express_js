const express = require("express");
const app = express();

// Runs before every request
app.use((req,res,next)=>{

    console.log("Request Received");

    next();

});

app.get("/",(req,res)=>{

    res.send("Welcome");

});

app.listen(3000);