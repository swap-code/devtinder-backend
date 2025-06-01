const express= require('express');
const app= express();

// Middleware Use
app.use("/user",(req,res,next)=>{
    const tocken= "xyz";
    const isAuth=tocken=== "xyz";
    if(!isAuth){
        return resd.status(401).json({message:"Unauthorized"});
    }
    else{
        next()
    }
})

app.get("/user/getAllData",(req,res)=>{
    res.status(200).send("All user data fetched successfully");
})
app.delete("/user/deleteData",(req,res)=>{
    res.status(200).send("User data deleted successfully");
})
app.post("/user/createData",(req,res)=>{
    res.status(201).send("User data created successfully");
})  


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});