const validator = require("validator");

const validateSignUpData = (req) => {
    
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName) {
        throw new Error("First name is required");
    }
    else if (firstName.length < 1 || firstName.length > 50) {
        throw new Error("First name should be less than 50 characters");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("Email is invalid");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is weak");
    }

};

const validateLoginData = (req) => {
        
    const { emailId } = req.body;

    if (!validator.isEmail(emailId)) {
        throw new Error("Email is invalid");
    }

}

module.exports = {
    validateSignUpData,
    validateLoginData,
};