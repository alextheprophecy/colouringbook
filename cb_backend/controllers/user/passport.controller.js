const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../models/user.model');
const {gen_token, add_cookie} = require('./login.controller');

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});


// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production'
        ? 'https://crayons.me/api/user/auth/google/callback'
        : 'http://localhost:5000/api/user/auth/google/callback',
    scope: ['profile', 'email']
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists 
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
            return done(null, user);
        }

        // If user doesn't exist, create new user
        user = new User({
            full_name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
        });

        await user.save();
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// Auth routes
const googleAuth = (req, res, next) => {
    // Force account selection if prompt=select_account is in query
    const options = {
        scope: ['profile', 'email'],
        session: false
    };
    
    if (req.query.prompt === 'select_account')
        options.prompt = 'select_account';
    
    passport.authenticate('google', options)(req, res, next);
};

const googleAuthCallback = passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
});

// Handle successful authentication
const handleGoogleAuthSuccess = async (req, res) => {
    const user = req.user;
    const access_token = gen_token(true, user)
    const refresh_token = gen_token(false, user)

    const uri = process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000'
    // Encode user data and token to be sent as URL parameters
    const userData = encodeURIComponent(JSON.stringify(user))
    // Add refresh token cookie and redirect with access token and user data
    add_cookie(res, 'refreshToken', refresh_token)
        .redirect(`${uri}/auth-success?token=${access_token}&user=${userData}`);
};

// Add logout function
const logout = async (req, res) => {
    console.log('Logout called');
    try {        
         // Clear all cookies
         res.clearCookie('refreshToken');
         res.clearCookie('connect.sid'); // Clear session cookie
         
         // Destroy session if it exists
         if (req.session) {
             req.session.destroy((err) => {
                 if (err) {
                     console.error('Session destruction error:', err);
                 }
             });
         }
         res.status(200).json({ message: 'Logged out successfully' });

 
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Error logging out' });
    }
};

module.exports = {
    googleAuth,
    googleAuthCallback,
    handleGoogleAuthSuccess,
    initialize: passport.initialize(),
    logout
};