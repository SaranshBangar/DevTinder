const express = require('express');
const profileRouter = express.Router();

const bcrypt = require('bcrypt');

const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');

// API to fetch a profile
profileRouter.get("/", userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
});

// API to update a profile
profileRouter.patch("/update", userAuth, async (req, res) => {

    try {
        if (!validateEditProfileData(req)) {
            return res.status(400).send("Invalid fields");
        }
        
        const loggedinUser = req.user;

        Object.keys(req.body).forEach(key => loggedinUser[key] = req.body[key]);

        await loggedinUser.save();

        res.json({
            message : "Profile updated successfully",
            data : loggedinUser
        });
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
});

// API to edit a password
profileRouter.patch("/password", userAuth, async (req, res) => {

    try {
        const loggedinUser = req.user;

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).send("Invalid fields");
        }

        const isOldPasswordValid = await loggedinUser.verifyPassword(oldPassword);

        if (isOldPasswordValid) {
            const hashPassword = await bcrypt.hash(newPassword, 5);

            loggedinUser.password = hashPassword;

            await loggedinUser.save();

            res.json({
                message : "Password updated successfully",
                data : loggedinUser
            })
        }
        else {
            res.status(400).send("Invalid password");
        };
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
})

module.exports = profileRouter;