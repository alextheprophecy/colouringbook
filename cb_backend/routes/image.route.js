const express =  require("express");
const {generatePageWithContext, regeneratePage, enhancePage, finishBook} = require("../controllers/book/colouring_book.controller");
const {verifyToken, verifyBook} = require('../middleware/auth');
const {getBookPDF} = require("../controllers/user/user.controller");

const router = express.Router();

router.get('/getBookPDF', [verifyToken, verifyBook], getBookPDF)
router.post('/generatePageWithContext', [verifyToken, verifyBook], generatePageWithContext)
router.post('/regeneratePage', [verifyToken, verifyBook], regeneratePage)
router.post('/enhancePage', [verifyToken, verifyBook], enhancePage)
router.post('/finishBook', [verifyToken, verifyBook], finishBook)

module.exports = router;
