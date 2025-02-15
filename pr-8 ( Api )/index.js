const express = require('express');


const port = 9876;
const app = express();

const databese = require('./config/db')
databese()

app.use(express.urlencoded())

app.use('/', require('./routes/inexRoute'))


app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false
    }
    console.log(`server is running on port : ${port}`);
})