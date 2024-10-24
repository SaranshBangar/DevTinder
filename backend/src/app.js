const express = require("express");
const app = express();
app.use(express.json()); 

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const connectDB = require("./config/database");

require('dotenv').config();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/auth/", authRouter);
app.use("/profile/", profileRouter);
app.use("/request/", requestRouter);


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