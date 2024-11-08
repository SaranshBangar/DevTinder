const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
        immutable: true,
        maxlength : 50,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid\n" + value);
            }
        },
    },

    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 8,
    },

    birthDate: {
        type : Date,
        required : true,
        validate(value) {
            if (value > new Date()) {
                throw new Error("Birth date cannot be in the future");
            }
        },
    },

    age : {
        type : Number,
        min : 18,
        max : 180,
    },

    gender : {
        type : String,
        enum : {
            values : ["male", "female", "other"],
            message : "{VALUE} is not supported",
        },
        validate(value) {
            if (["male", "female", "other"].includes(value.toLowerCase()) === false) {
                throw new Error("Gender is not valid");
            }
        },
    },

    photoUrl : {
        type : String,
        default : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("URL is invalid\n" + value);
            }
        },
    },

    about : {
        type : String,
        default : "Hey there! I am using DevTinder",
        maxlength : 255,
    },

    skills : {
        type : [String],
        default : [],
        validate(value) {
            if (value.length > 10) {
                throw new Error("Only 10 skills are allowed");
            }
        },
    },

    location : {
        type : String,
        validator (value) {
            if (value.length > 50) {
                throw new Error("Occupation is too long");
            }
            else if (value.length < 1) {
                throw new Error("Occupation is too short");
            }
            else if (/\d/.test(value)) {
                throw new Error("Occupation should not contain numbers");
            }
        }
    },

    occupation : {
        type : String,
        validator (value) {
            if (value.length > 50) {
                throw new Error("Occupation is too long");
            }
            else if (value.length < 1) {
                throw new Error("Occupation is too short");
            }
            else if (/\d/.test(value)) {
                throw new Error("Occupation should not contain numbers");
            }
        }
    },
},
{
    timestamps : true,
});

userSchema.methods.getJWT = async function () {

    const user = this;

    const token = await jwt.sign({_id : user._id}, process.env.JWT_SECRET, {
        expiresIn : "8h",
    })

    return token;
};

userSchema.methods.verifyPassword = async function (password) {
    
    const user = this;
    const hashedPassword = user.password;

    return await bcrypt.compare(password, hashedPassword);
};

module.exports = mongoose.model("User", userSchema);