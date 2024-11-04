const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');


REQUEST_SAFE_DATA = ["firstName", "lastName", "photoUrl", "gender", "age", "about", "skills", "occupation", "location"];
CONNECTION_SAFE_DATA = ["firstName", "lastName", "emailId", "photoUrl", "about", "skills", "age", "occupation", "gender", "location", "birthDate"];
FEED_SAFE_DATA = ["firstName", "lastName", "photoUrl", "gender", "age", "about", "skills", "occupation", "location"];

// API to get all the pending connection requests
userRouter.get("/requests", userAuth, async (req, res) => {

    try {
        const LoggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            receiverId : LoggedInUser._id,
            status : "like"
        }).populate (
            "senderId",
            REQUEST_SAFE_DATA
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
            CONNECTION_SAFE_DATA
        ).populate (
            "receiverId",
            CONNECTION_SAFE_DATA
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

// API to show the feed to the user
userRouter.get("/feed", userAuth, async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    if (limit > 20) {
        limit = 20;
    }
    
    try {
        const LoggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or : [
                { senderId : LoggedInUser._id },
                { receiverId : LoggedInUser._id }
            ],
        }).select("senderId receiverId status").populate("senderId receiverId", FEED_SAFE_DATA);

        const hiddenUsers = new Set();
        connectionRequest.forEach((req) => {
            hiddenUsers.add(req.senderId._id.toString());
            hiddenUsers.add(req.receiverId._id.toString());
        });
        
        const users = await User.find({
            _id : { $nin : [...hiddenUsers, LoggedInUser._id] }
        }).skip((page - 1) * limit).limit(limit);

        res.status(200).json({
            message : "Data fetched successfully",
            data : users,
        });
    }
    catch (err) {
        res.status(400).send("Err : " + err.message);
    }
})

// API to remove a connection
userRouter.delete("/remove/:id", userAuth, async (req, res) => {

    try {
        const LoggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.findOneAndDelete({
            $or : [
                { senderId : LoggedInUser._id, receiverId : req.params.id },
                { senderId : req.params.id, receiverId : LoggedInUser._id }
            ]
        });

        if (!connectionRequest) {
            return res.status(400).json({
                message : "Connection not found",
            });
        }

        res.status(200).json({
            message : "Connection removed successfully",
        });
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
})

module.exports = userRouter;