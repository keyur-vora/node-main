const express = require('express');

const routes = express.Router();

const { verifyToken, checkAdmin } = require('../middlewaer/Auth');

const { addComment, adminViewComment } = require('../controller/CommentController');

routes.post('/addcomment',verifyToken,addComment)
routes.get('/adminviewcomment',verifyToken,checkAdmin,adminViewComment)

module.exports = routes;