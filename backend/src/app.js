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