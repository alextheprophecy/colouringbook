const express =  require("express");
const {Register,Login} = require("../controllers/user/login.controller");
const router = express.Router();


router.post('/register', Register);
router.post('/login', Login);


module.exports = router;