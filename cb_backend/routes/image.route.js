const express =  require("express");
const {generatePageWithContext, regeneratePage, enhancePage, getBookPDF} = require("../controllers/book/colouring_book.controller");
const {verifyToken, verifyBook} = require('../middleware/auth');

const router = express.Router();

router.get('/getBookPDF', [verifyToken, verifyBook], getBookPDF)
router.post('/generatePageWithContext', [verifyToken, verifyBook], generatePageWithContext)
router.post('/regeneratePage', [verifyToken, verifyBook], regeneratePage)
router.post('/enhancePage', [verifyToken, verifyBook], enhancePage)
router.post('/finishBook', [verifyToken, verifyBook], getBookPDF)
router.get('/getBookPDF', [verifyToken, verifyBook], getBookPDF)

module.exports = router;
