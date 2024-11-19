const checkBlocked = async (req, res, next) => {
    if (req.user && req.user.isBlocked) {
        return res.status(403).json({ 
            message: 'Your account has been blocked. Please contact support for more information.' 
        });
    }
    next();
};

module.exports = checkBlocked; 