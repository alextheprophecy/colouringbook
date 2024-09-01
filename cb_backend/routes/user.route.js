const express =  require("express");
const {Register,Login} = require("../controllers/user/login.controller");
const {getUserBooks} = require("../controllers/user/user.controller");
const {verifyToken} = require("../middleware/auth");
const {clientUrl} = require("../controllers/external_apis/aws.controller");
const router = express.Router();


router.post('/register', Register);
router.post('/login', Login);
router.get('/getBooks', verifyToken, getUserBooks);
// router.get('/testUrl', verifyToken, clientUrl)



module.exports = router;