const express =  require("express");
// const {modifyImg} = require("../controllers/image.controller");
const {handleQuery} = require("../controllers/openai.controller");
const {genColouringBook, genTest} = require("../controllers/colouring_book.controller");
const {verifyToken} = require('../middleware/auth');

const router = express.Router();

router.get('/generateImages', verifyToken, genColouringBook)
router.get('/test', verifyToken, genTest)

module.exports = router;