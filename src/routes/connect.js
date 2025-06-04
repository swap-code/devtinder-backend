const express = require('express');
const userAuth = require('../middleware/auth');
const connect= express.Router();

connect.post("/sendConnection", userAuth, async (req,res)=>{
  res.send({
    message: "Connection request sent successfully",
    user: req.user
  });
});
module.exports = connect;