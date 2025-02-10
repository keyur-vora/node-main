const mongoose = require('mongoose')

const databese = async () => {
    try {
        let db = mongoose.connect('mongodb://127.0.0.1:27017/Movie-crude')
        console.log(`MongoDB Connected...`);
    } catch (error) {
        console.error(error)
        return;
    }
}
module.exports = databese;