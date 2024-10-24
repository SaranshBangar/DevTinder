const express = require('express');
const requestRouter = express.Router();

const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/user');

const { userAuth } = require('../middlewares/auth');

// API to send a connection request
requestRouter.post("/send/:status/:receiverId", userAuth, async (req, res) => {
    
    try {
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;
        const status = req.params.status;

        const allowedStatus = ["like", "dislike"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status");
        }

        if (senderId.toString() === receiverId.toString()) {
            return res.status(400).send("You cannot send request to yourself");
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ],
        })
        if (existingRequest) {
            return res.status(400).send("Request already sent or pending");
        }

        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(400).send("Receiver not found");
        }
        
        const connectionRequest = new ConnectionRequest({
            senderId,
            receiverId,
            status,
        });
        
        await connectionRequest.save();
        res.status(201).send(connectionRequest);

        res.json({
            message: "Connection request sent",
            data,
        })
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
});

module.exports = requestRouter;