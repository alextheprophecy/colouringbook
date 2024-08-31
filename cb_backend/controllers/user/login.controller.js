const User = require('../../models/user.model')
const jwt = require('jsonwebtoken')

const jwt_TTL = '1h'

const emailValidator = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
};

class UserControllers {

    static Register = (req, res, next) => {
        const { full_name, email, password } = req.body

        if (!emailValidator(email)) return res.status(400).json('Enter a valid email');

        User.findOne({ email: email })
            .then(existingUser => {
                if (existingUser)return res.status(400).json('This user already exists')
                const newUser = new User({full_name, email, password})
                return newUser.save()
            })
            .then(() => res.status(201).json("User created successfully"))
            .catch(error => next(error))
    }

    static Login = (req, res, next) => {
        const { email, password } = req.body

        if (!email || !password) return res.status(400).json('Please provide email and password')

        User.findOne({ email: email }).then(user => {
            if (!user) return res.status(404).json('No account under this email')

            return user.matchPassword(password).then(isMatch => {
                if (!isMatch) {
                    return res.status(401).json('Incorrect email password combination')
                }

                // Generate JWT token
                const token = jwt.sign(
                    { id: user._id, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn: jwt_TTL}
                )

                // Use `toObject` to safely convert Mongoose document to a plain object
                const otherDetails = user.toObject()
                delete otherDetails.password

                res.status(200).json({ user: { ...otherDetails, token } })
            });
        }).catch(error => {
            next(error)
        })
    }

}

module.exports = UserControllers