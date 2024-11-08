const express = require("express");
const app = express();
app.use(express.json()); 

const cors = require("cors");
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const connectDB = require("./config/database");

require('dotenv').config();

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");

app.use("/auth/", authRouter);
app.use("/profile/", profileRouter);
app.use("/request/", requestRouter);
app.use("/user/", userRouter);


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