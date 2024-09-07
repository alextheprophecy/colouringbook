const express =  require("express");
const {Register,Login, RefreshToken} = require("../controllers/user/login.controller");
const {getUserBooks} = require("../controllers/user/user.controller");
const {verifyToken} = require("../middleware/auth");
const {clientUrl} = require("../controllers/external_apis/aws.controller");
const router = express.Router();

const testAuth = (req, res) => {
    res.status(200).send('OK! Good Job')
}



router.post('/register', Register);
router.post('/login', Login);
router.get('/getBooks', verifyToken, getUserBooks);
router.get('/refreshToken', RefreshToken)
router.get('/testAuth', verifyToken, testAuth)


module.exports = router;