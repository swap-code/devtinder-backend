const express= require('express');
const app= express();

app.use("/test",(req,res)=>{
    res.send("test is work")
})

app.use("/test2",(req,res)=>{
    res.send("test2 is work")
});

app.use("/test3",(req,res)=>{
    res.send("test3 is work")
});
app.listen(3000);