const express =  require("express");
// const {modifyImg} = require("../controllers/image.controller");
const {handleQuery} = require("../controllers/openai.controller");
const {genColouringBook} = require("../controllers/colouring_book.controller");
const router = express.Router();

// router.get('/modify',modifyImg);
router.get('/generate', genColouringBook)
module.exports = router;