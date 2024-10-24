const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    status : {
        type : String,
        enum : {
            values : ["like", "dislike", "accepted", "rejected"],
            message : `{VALUE} is not supported`,
        },
        required : true,
    }
}, {
    timestamps : true
})

connectionRequestSchema.index({ senderId: 1, receiverId: 1 });

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;

    if (connectionRequest.senderId.toString() === connectionRequest.receiverId.toString()) {
        throw new Error("You cannot send request to yourself");
    }

    next();
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;