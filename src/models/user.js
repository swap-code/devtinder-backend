const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true
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
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number,
        required: true
    },
    gender:{
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    }
})
;
const User=mongoose.model('User', userSchema);
module.exports = User;
