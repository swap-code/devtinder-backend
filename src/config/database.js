const mongoose= require('mongoose');

const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://yadavswapnil903:XK4GaWpTEgvkKQCG@cluster0.nnu0d5q.mongodb.net/?retryWrites=true&w=majority&appName=Devtinder")
}
module.exports= connectDB;



// yadavswapnil903
//XK4GaWpTEgvkKQCG
// mongodb+srv://yadavswapnil903:XK4GaWpTEgvkKQCG@cluster0.nnu0d5q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0