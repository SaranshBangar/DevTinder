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

};

const validateEditProfileData = (req) => {
    const allowedFields = [
        "firstName",
        "lastName",
        "about",
        "skills",
        "photoUrl",
        "birthDate",
        "age",
        "gender",
        "location",
        "occupation"
    ];

    const invalidFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
        return {
            isValid: false,
            error: `Invalid fields: ${invalidFields.join(', ')}`
        };
    }

    const validations = {
        firstName: (value) => {
            if (typeof value !== 'string' || value.length < 1 || value.length > 50) {
                return 'First name must be between 1 and 50 characters';
            }
        },
        lastName: (value) => {
            if (value && (typeof value !== 'string' || value.length > 50)) {
                return 'Last name must not exceed 50 characters';
            }
        },
        about: (value) => {
            if (value && (typeof value !== 'string' || value.length > 255)) {
                return 'About must not exceed 255 characters';
            }
        },
        skills: (value) => {
            if (value && (!Array.isArray(value) || !value.every(skill => typeof skill === 'string'))) {
                return 'Skills must be an array of strings';
            }
        },
        age: (value) => {
            if (value && (typeof value !== 'number' || value < 18 || value > 180)) {
                return 'Age must be between 18 and 180';
            }
        },
        gender: (value) => {
            if (value && !['male', 'female', 'other'].includes(value.toLowerCase())) {
                return 'Gender must be male, female, or other';
            }
        },
        location: (value) => {
            if (value && (typeof value !== 'string' || value.length < 1 || value.length > 50 || /\d/.test(value))) {
                return 'Location must be 1-50 characters and cannot contain numbers';
            }
        },
        occupation: (value) => {
            if (value && (typeof value !== 'string' || value.length < 1 || value.length > 50 || /\d/.test(value))) {
                return 'Occupation must be 1-50 characters and cannot contain numbers';
            }
        }
    };

    for (const [field, value] of Object.entries(req.body)) {
        const validationError = validations[field]?.(value);
        if (validationError) {
            return {
                isValid: false,
                error: validationError
            };
        }
    }

    return {
        isValid: true
    };
};

module.exports = {
    validateSignUpData,
    validateLoginData,
    validateEditProfileData
};