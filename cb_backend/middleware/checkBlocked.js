const User = require('../models/user.model');

const checkBlocked = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select('isBlocked')
            .lean();

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({ 
                message: 'Your account has been blocked. Please contact support for more information.' 
            });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error checking user status'
        });
    }
};

module.exports = checkBlocked; 