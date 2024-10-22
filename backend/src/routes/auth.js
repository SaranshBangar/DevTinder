const express = require('express');
const authRouter = express.Router();

const bcrypt = require('bcrypt');

const User = require('../models/user');

const { validateSignUpData, validateLoginData } = require('../utils/validation');

// API to add a new user
authRouter.post("/signup", async (req, res) => {

    try {
        validateSignUpData(req);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }

    const { firstName, lastName, emailId, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 5);

    const user = new User({
        firstName,
        lastName,
        emailId,
        password : hashPassword,
    });

    try {
        await user.save();
        res.status(200).send("User added successfully\n" + user);
    }
    catch (err) {
        res.status(400).send("User could not be added" + err.message);  
    }

})

// API to login a user
authRouter.post("/login", async (req, res) => {

    try {
        validateLoginData(req);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }

    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(404).send("Invalid credentials");
        }

        const isPasswordValid = await user.verifyPassword(password);

        if (isPasswordValid) {

            const token = await user.getJWT();

            res.cookie("token", token, {
                expires : new Date(Date.now() + 8 * 3600000),
            });
            
            res.status(200).send("User logged in successfully");
        }
        else {
            res.status(400).send("Invalid credentials");
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }

})

// API to logout a user
authRouter.post("/logout", async (req, res) => {
        res.clearCookie("token");
        res.status(200).send("User logged out successfully");
})

module.exports = authRouter;