const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
         validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email format');
            }
         }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number,
       
    },
    gender:{
        type: String,
  
        enum: ['male', 'female', 'other']
    },
    photoUrl: {
        type: String,
     
        trim: true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Invalid photo url');
            }
         }
    },
    about: {
        type: String,
   
        trim: true
    },
    skills: {
        type: [String],

    },
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});
const User=mongoose.model('User', userSchema);
module.exports = User;
