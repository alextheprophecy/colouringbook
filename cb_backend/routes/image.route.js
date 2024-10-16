const express =  require("express");
const {test, generateSingleScenePage} = require("../controllers/book/colouring_book.controller");
const {verifyToken} = require('../middleware/auth');
const {generateUserBook, getBookPDF, generateBookDescription} = require("../controllers/user/user.controller");

const router = express.Router();

router.post('/generateImages', verifyToken, generateUserBook)
router.post('/generateDescription', verifyToken, generateBookDescription)
router.get('/getBookPDF', verifyToken, getBookPDF)
router.get('/test', verifyToken, test)
router.post('/generateSingleScenePage', verifyToken, generateSingleScenePage)

module.exports = router;
