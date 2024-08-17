const express =  require("express");
const {modifyImg} = require("../controllers/image.controller");
const router = express.Router();

router.get('/modify',modifyImg);
module.exports = router;