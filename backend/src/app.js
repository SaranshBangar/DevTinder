const express = require("express");
const app = express();
app.use(express.json()); 

const connectDB = require("./config/database");

const User = require("./models/user");

app.post("/signup", async (req, res) => {

    const user = new User(req.body);

    console.log(req.body);

    try {
        await user.save();
        res.status(200).send("User added successfully" + user);
    }
    catch (err) {
        res.status(400).send("User could not be added" + err.message);  
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