const express = require("express");

const app = express();

app.use("/", (req, res) => {
    res.send("DevTinder");
})

app.use("/hello", (req, res) => {
    res.send("Hello from the server!");
})

app.use("/test", (req, res) => {
    res.send("Server is testing!");
})

app.use("/sample", (req, res) => {
    res.send("Sample response from the server!");
})

app.listen(3000, () => {
    console.log("Server is running successfully at port 3000!");
});