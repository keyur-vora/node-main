const express = require('express')

const routes = express.Router()


const multer = require('multer')
const { addBlog, adminviewBlog, userwiseviewBlog, admindeleteBlog, updateBlog, userwiseDeleteBlog } = require('../controller/Blogcontroller')
const { verifyToken, checkAdmin } = require('../middlewaer/Auth')

const st = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        let uniq = Math.floor(Math.random() * 100000)
        cb(null, `${file.fieldname} - ${uniq}`)
    }
})

const blogImage = multer({ storage: st }).single('image')


routes.post('/addblog', verifyToken, blogImage, addBlog)
routes.get('/adminviewblog', verifyToken, checkAdmin, adminviewBlog)
routes.get('/userwiseviewblog',verifyToken, userwiseviewBlog)
routes.get('/admindeleteblog',verifyToken,checkAdmin,admindeleteBlog)
routes.put('/updateblog',verifyToken,blogImage,updateBlog)
routes.delete('/userwisedeleteblog',verifyToken,userwiseDeleteBlog)


module.exports = routes;