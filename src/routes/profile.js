const express = require("express");
const userAuth = require("../middleware/auth");
const { validate } = require("../models/user");
const { validateProfileEditData } = require("../helper/validation");
const profile = express.Router();

profile.get("/profile/view", userAuth, async (req, res) => {
  const user = req.user; // Use the user attached by the userAuth middleware
  res.send(user);
});

profile.patch("/profile/edit", userAuth,(req,res)=>{
    try{
      if(!validateProfileEditData(req))
      {
        return res.status(400).send("Invalid profile edit data");
      }
      const user = req.user; // Use the user attached by the userAuth middleware
       Object.keys(req.body).forEach((key)=>(

        user[key] = req.body[key]
      ));
      user.save()
        .then(() => res.send("Profile updated successfully"))
        .catch(err => res.status(500).send("Error updating profile"));
        

    }
    catch(err){
        console.error("Error updating profile:", err);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = profile;
