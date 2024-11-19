const express = require("express");
const {generatePageWithContext, regeneratePage, enhancePage, getBookPDF, finishBook} = require("../controllers/book/colouring_book.controller");
const {verifyToken, verifyBook} = require('../middleware/auth');
const verifyPageGeneration = require('../middleware/verifyPageGeneration');

const router = express.Router();

// PDF Routes
router.get('/getBookPDF', [verifyToken, verifyBook], getBookPDF);
router.post('/finishBook', [verifyToken, verifyBook], finishBook);

// Page Generation Routes
router.post('/generate', [verifyToken, verifyBook, verifyPageGeneration], generatePageWithContext);
router.post('/regenerate', [verifyToken, verifyBook, verifyPageGeneration], regeneratePage);
router.post('/enhance', [verifyToken, verifyBook, verifyPageGeneration], enhancePage);

module.exports = router;
