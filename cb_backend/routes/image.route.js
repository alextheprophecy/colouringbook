const express =  require("express");
// const {modifyImg} = require("../controllers/image.controller");
const {handleQuery} = require("../controllers/openai.controller");
const router = express.Router();

// router.get('/modify',modifyImg);
router.get('/query', handleQuery)
module.exports = router;