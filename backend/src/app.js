const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

// app.use("/admin", adminAuth);

// app.get("/admin/getData", (req, res) => {
//     res.send("Fetched all data!");
// });

// app.get("/admin/deleteData", (req, res) => {
//     res.send("Deleted data!");
// });

// app.use("/user/login", (req, res) => {
//     res.send("User login successfull!");
// });

// app.use("/user", userAuth, (req, res) => {
//     res.send("Accessed user data!");
// });

app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("Something went wrong!");
    } else {
        next();
    }
});

app.get("/", (req, res) => {
    res.send("User data fetched successfully!");
});

app.listen(3000, () => {
    console.log("Server is running successfully at port 3000!");
});