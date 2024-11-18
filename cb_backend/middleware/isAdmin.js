const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }    
    next();
};

module.exports = isAdmin; 