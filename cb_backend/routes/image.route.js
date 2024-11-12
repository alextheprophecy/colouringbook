const express = require("express");
const {generatePageWithContext, regeneratePage, enhancePage, getBookPDF, finishBook} = require("../controllers/book/colouring_book.controller");
const {verifyToken, verifyBook} = require('../middleware/auth');

const router = express.Router();

// PDF Routes
router.get('/getBookPDF', [verifyToken, verifyBook], getBookPDF);
router.post('/finishBook', [verifyToken, verifyBook], finishBook);

// Page Generation Routes
router.post('/generatePageWithContext', [verifyToken, verifyBook], generatePageWithContext);
router.post('/regeneratePage', [verifyToken, verifyBook], regeneratePage);
router.post('/enhancePage', [verifyToken, verifyBook], enhancePage);

module.exports = router;
