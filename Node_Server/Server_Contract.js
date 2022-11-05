const Express = require("express")
var mysql = require('mysql');
const ContractFunction = require("./ContractFunctions")
require('dotenv').config()


const app = Express()


// Connect to Mysql
var con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    insecureAuth: true
});


// Check Database is connected
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected To Database!");
});


// API requests
app.get("/api/v1/healthcheck", (req, res)=>{
    res.status(200)
    res.json({HealtCheck: true})
})

app.get("/api/v1/balances", (req, res)=>{
    res.send("GetBalances")
})

app.post("/api/v1/balances", (req, res)=>{
    res.send("PostBalances")
})


// Check Express Server is connect 
app.listen(3005, () => { console.log("server is run on port 3005") })