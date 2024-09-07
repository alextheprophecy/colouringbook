const express =  require("express");
// const {modifyImg} = require("../controllers/image.controller");
const {handleQuery} = require("../controllers/external_apis/openai.controller");
const {genColouringBook, test} = require("../controllers/book/colouring_book.controller");
const {verifyToken} = require('../middleware/auth');
const {generateUserBook, getBookPDF, generateBookDescription} = require("../controllers/user/user.controller");
const {clientUrl} = require("../controllers/external_apis/aws.controller");

const router = express.Router();

router.post('/generateImages', verifyToken, generateUserBook)
router.get('/generateDescription', verifyToken, generateBookDescription)
router.get('/getBookPDF', verifyToken, getBookPDF)
router.get('/test', verifyToken, test)

module.exports = router;