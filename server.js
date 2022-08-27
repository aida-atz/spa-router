
const express=require("express");
const path = require("path");
const app = express();
app.use(express.static(path.resolve(__dirname)))
app.get("/*",(reg,res)=>{
    res.sendFile(path.resolve(__dirname,"pages","index.html"))
})
app.listen(5051,()=>console.log("server is running ..."))