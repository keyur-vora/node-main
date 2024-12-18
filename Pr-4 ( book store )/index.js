const express = require('express')
const app = express()
const port = 8000

// Mongo Connection
const connectDB = require('./config/db');
connectDB();

// connect user model / collection
const BookModel = require(`./models/bookModel`);
const fs = require('fs')

app.set('view engine', 'ejs')
app.use(express.urlencoded())


const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const multer = require('multer');

const { unlinkSync } = require('fs');

const st = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        const uniqname = Date.now();
        cb(null, file.fieldname + '-' + uniqname)
    }
})

const fileUplad = multer({ storage: st }).single('image');
app.get('/view', (req, res) => {
    BookModel.find({})
        .then((detail) => {
            return res.render('ViewStore', {
                detail
            })
        })
})

app.get('/', (req, res) => {

    return res.render('AddBook')
})
app.post('/insertDetail', fileUplad, (req, res) => {

    // console.log(req.body);
    const { name, price, pages, author } = req.body
    BookModel.create({
        name: name,
        price: price,
        pages: pages,
        author: author,
        image: req.file.path
    })
        .then((data) => {
            console.log(data);
            return res.redirect('/View')
        })
        .catch((err) => {
            console.log(err);
            return false;

        })
})

// delete 
app.get('/delete/', (req, res) => {
    const delid = req.query.deletId;

    // unlink 
    BookModel.findById(delid)
        .then((single) => {
            fs.unlinkSync(single.image)
            // console.log(delid);
            BookModel.findByIdAndDelete(delid)
                .then((data) => {

                    return res.redirect('/View')

                })
                .catch((err) => {
                    console.log(err);
                    return false;

                })
        })
        .catch((err) => {
            console.log(err);
            return false;

        })



})
// editid
app.get('/edit', (req, res) => {
    const eid = req.query.editId;
    // console.log(eid);
    BookModel.findById(eid)
        .then((single) => {
            // console.log(single);

            return res.render('EditBook', {
                single
            })
        })
})
// update
app.post('/updatetDetail', fileUplad, (req, res) => {
    const { editid, name, price, pages, author } = req.body
    if (req.file) {
        BookModel.findById(editid)
            .then((single) => {

                fs.unlinkSync(single.image)

            })
            .catch((err) => {
                console.log(err);
                return false;
            })
        BookModel.findByIdAndUpdate(editid, {
            name: name,
            price: price,
            pages: pages,
            author: author,
            image: req.file.path
        })
            .then((data) => {
                return res.redirect('/View')

            })
            .catch((err) => {
                console.log(err);
                return false;
            })

    } else {
        BookModel.findById(editid)
            .then((single) => {
                BookModel.findByIdAndUpdate(editid, {
                    name: name,
                    price: price,
                    pages: pages,
                    author: author,
                    image: single.image
                })
                    .then((data) => {
                        return res.redirect('/View')
                    })
                    .catch((err) => {
                        console.log(err);
                        return false;

                    })

            })

    }

    // BookModel.findByIdAndUpdate(editId,{
    //     name:name,
    //     price:price,
    //     pages:pages,
    //     author:author,
    //     // image: req.file.path
    // })
    // .then((data) =>{
    //     console.log(data);
    //     return res.redirect('/View')

    // })
    // .catch((err) =>{
    //     console.log(err);
    //     return false;

    // })

})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false
    }
    console.log(`Server is running on port ${port}`)
})