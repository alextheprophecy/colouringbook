const express =  require("express");
// const {modifyImg} = require("../controllers/image.controller");
const {handleQuery} = require("../controllers/external_apis/openai.controller");
const {genColouringBook, genTest} = require("../controllers/book/colouring_book.controller");
const {verifyToken} = require('../middleware/auth');
const generateUserBook = require("../controllers/user/user.controller");

const router = express.Router();

router.post('/generateImages', verifyToken, generateUserBook)
// router.post('/test', verifyToken, genTest)

module.exports = router;