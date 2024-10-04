const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://saranshbangar:ZxraCMPWR7JIELn4@namastenode.v0dcw.mongodb.net/devTinder');
}

module.exports = connectDB;