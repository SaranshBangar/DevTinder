const express = require("express");
const app = express();
app.use(express.json()); 

const connectDB = require("./config/database");

const { validateSignUpData, validateLoginData } = require("./utils/validation");

const bcrypt = require("bcrypt");

const User = require("./models/user");


// API to add a new user
app.post("/signup", async (req, res) => {

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
app.post("/login", async (req, res) => {

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

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
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

// API to fetch all the users for the feed page
app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({});
        res.status(200).send(users);
    }
    catch (err) {
        res.status(400).send("Users could not be fetched");
    }

})

// API to delete a particular user
app.delete("/user", async (req, res, next) => {

    const userEmail = req.body.emailId;
    const userPassword = req.body.password;

    try {
        const user = await User.findOne({ emailId: userEmail, password: userPassword });
        if (!user) {
            res.status(404).send("User not found");
        }
        else {
            let userId = user._id;
            req.userId = userId;
            next();
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong 1");
    }

}, async (req, res) => {
    
    try {
        await User.findByIdAndDelete(req.userId);
        res.status(200).send("User deleted successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong 2");
    }

})

// API to update a particular user
app.patch("/user/:userId", async (req, res) => {

    // Updates a user with the given userId
        const userId = req.params?.userId;
        const updatedData = req.body;

        try {

            const allowedUpdates = ["password", "age", "gender", "photoUrl", "about", "skills"];

            const isUpdateAllowed = Object.keys(updatedData).every((update) => {
                return allowedUpdates.includes(update);
            });

            if (!isUpdateAllowed) {
                return res.status(400).send("Invalid updates");
            }

            if (updatedData.skills && Array.isArray(updatedData.skills) && updatedData.skills.length > 10) {
                return res.status(400).send("Skills array cannot have more than 10 items");
            }

            await User.findByIdAndUpdate(userId, updatedData);
            res.status(200).send("User updated successfully");
        }
        catch (err) {
            res.status(400).send("Something went wrong");
        }

    // Updates a user with the given emailId
        // const userEmail = req.body.emailId;
        // const updatedData = req.body;

        // try {
        //     await User.findOneAndUpdate
        //     (
        //         {
        //             emailId: userEmail
        //         },
        //         updatedData,
        //         {
        //             runValidators: true,
        //             new: true,
        //         }
        //     );
        //     res.status(200).send("User updated successfully");
        // }
        // catch (err) {
        //     res.status(400).send("Something went wrong");
        // }

})

connectDB()
    .then(() => {
        console.log('Database connected');
        app.listen(3000, () => {
            console.log("Server is running successfully at port 3000!");
        });
    })
    .catch((err) => {
        console.log("Database not connected ->", err.message);
    });