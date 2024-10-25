const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

USER_SAFE_DATA = ["firstName", "lastName", "photoURL", "gender", "age", "about", "skills"];

// API to get all the pending connection requests
userRouter.get("/requests", userAuth, async (req, res) => {

    try {
        const LoggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            receiverId : LoggedInUser._id,
            status : "like"
        }).populate (
            "senderId",
            USER_SAFE_DATA
        );

        res.status(200).json({
            message : "Data fetched successfully",
            data : connectionRequest,
        });
    }
    catch (err) {
        res.status(400).send("Ërror : " + err.message);
    }
})

// API to get all the accepted connection requests
userRouter.get("/connections", userAuth, async (req, res) => {

    try {
        const LoggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or : [
                { senderId : LoggedInUser._id, status : "accepted" },
                { receiverId : LoggedInUser._id, status : "accepted" }
            ],
        }).populate (
            "senderId",
            USER_SAFE_DATA
        ).populate (
            "receiverId",
            USER_SAFE_DATA
        );

        const data = connectionRequest.map((row) => {
            if (row.senderId._id.toString() === LoggedInUser._id.toString()) {
                return row.receiverId;
            }
            else return row.senderId;
        })

        res.status(200).json({
            message : "Data fetched successfully",
            data : data,
        });
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
})

module.exports = userRouter;