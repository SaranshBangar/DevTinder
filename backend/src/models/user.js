const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
        minlength : 1,
        maxlength : 50,
    },
    lastName : {
        type : String,
        trim : true,
        maxlength : 50,
    },
    emailId : {
        type: String,
        required : true,
        lowercase : true,
        trim : true,
        unique : true,
        maxlength : 50,
        validate(value) {
            if (!value.includes('@')) {
                throw new Error("Email is not valid");
            }
        },
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 8,
    },
    age : {
        type : Number,
        min : 18,
        max : 150,
    },
    gender : {
        type : String,
        validate(value) {
            if (["male", "female", "other"].includes(value.toLowerCase()) === false) {
                throw new Error("Gender is not valid");
            }
        },
    },
    photoUrl : {
        type : String,
        default : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
    },
    about : {
        type : String,
        default : "Hey there! I am using DevTinder",
        maxlength : 255,
    },
    skills : {
        type : [String],
    },
}, {
    timestamps : true,
});

module.exports = mongoose.model("User", userSchema);