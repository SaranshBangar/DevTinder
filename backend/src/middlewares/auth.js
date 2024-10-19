const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {

    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send("Unauthorized access");
        }

        const jwtObj = await jwt.verify(token, "Yeh_Mat_Churana@Please520");

        if (!jwtObj) {
            return res.status(401).send("Unauthorized access");
        }

        const { _id } = jwtObj;

        if (!_id) {
            return res.status(401).send("Unauthorized access");
        }

        const user = await User.findById(_id);

        if (!user) {
            return res.status(401).send("Unauthorized access");
        }

        req.user = user;

        next();
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
};

module.exports = {
    userAuth,
};