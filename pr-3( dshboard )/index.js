const express = require('express');
const app = express();
const port = 8800;
app.set('view engine', 'ejs')

const path = require('path')

app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    return res.render('login')
})

app.get('/dashboard', (req, res) => {
    return res.render('dashboard')
})

app.get('/icons', (req, res) => {
    return res.render('icons')
})

app.get('/table', (req, res) => {
    return res.render('table')
})

app.get('/type', (req, res) => {
    return res.render('type')
})

app.get('/maps', (req, res) => {
    return res.render('maps')
})

app.get('/notifications', (req, res) => {
    return res.render('notifications')
})

app.get('/user', (req, res) => {
    return res.render('user')
})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return flase;
    }
    console.log("server hasbeen started on port . . .");


}) 