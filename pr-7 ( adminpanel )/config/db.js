const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:27017/pr-adminpanel`);


const db = mongoose.connection;

db.on("connected", (err) => {
    if (err) {
        console.log(err);
        return false
    }
    console.log(` DATABASE HAS BEEN CONNECCTED . . .`);
})

module.exports = db;