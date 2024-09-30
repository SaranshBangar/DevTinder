const adminAuth = (req, res, next) => {
    const token = "admin";
    const isAdmin = (token === "admin");
    if (isAdmin) {
        next();
    }
    else {
        res.status(401).send("You are not authorized!");
    }
};

const userAuth = (req, res, next) => {
    const token = "user";
    const isUser = (token === "user");
    if (isUser) {
        next();
    }
    else {
        res.status(401).send("You are not authorized!");
    }
};

module.exports = {
    adminAuth,
    userAuth,
};