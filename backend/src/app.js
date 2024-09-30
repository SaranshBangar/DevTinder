// const express = require("express");

// const app = express();

// // : is used to define a route parameter
// app.get("/user/:userId", (req, res) => {

//     // console.log(req.query); // It will print the query params

//     console.log(req.params)

//     res.send({firstName: "Dev", lastName: "Singh"});
// })

// // This will match /user and /uer
// // app.get("/us?er", (req, res) => {
// //     res.send({firstName: "Dev", lastName: "Singh"});
// // })

// // This will match /user, /usser, /ussser, /usssser, and so on. 
// // app.get("/us+er", (req, res) => {
// //     res.send({firstName: "Dev", lastName: "Singh"});
// // })

// // This will match /user, /usabcder, /usxyzer, /usrrr, and so on.
// // app.get("/us*er", (req, res) => {
// //     res.send({firstName: "Dev", lastName: "Singh"});
// // })

// app.post("/user", (req, res) => {
//     console.log("Save user to database!");
//     res.send("User is saved successfully!");
// })

// app.patch("/user", (req, res) => {
//     console.log("Update user to database!");
//     res.send("User is updated successfully!");
// })

// app.delete("/user", (req, res) => {
//     res.send("Deleted successfully!");
// })

// app.use("/test", (req, res) => {
//     res.send("Server is testing!");
// })

// app.listen(3000, () => {
//     console.log("Server is running successfully at port 3000!");
// });

const express = require("express");

const app = express();

app.use("/user", 
    [
        (req, res, next) => {
            console.log("Middleware 1");
            next();
        },
        (req, res, next) => {
            console.log("Middleware 2");
            next();
        },
        (req, res, next) => {
            console.log("Middleware 3");
            next();
        },
        (req, res, next) => {
            console.log("Middleware 4");
            res.send("Reached 4th route!");
        }
    ]
);

app.listen(3000, () => {
    console.log("Server is running successfully at port 3000!");
});