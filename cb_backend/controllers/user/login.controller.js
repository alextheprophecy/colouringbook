const User = require('../../models/user.model')
const jwt = require('jsonwebtoken')

const access_TTL = '10s'
const refresh_TTL = '7d'

const emailValidator = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

const gen_token = (access_t = true, user) => jwt.sign(
    { id: user._id, email: user.email },
    access_t?process.env.JWT_ACCESS_SECRET:process.env.JWT_REFRESH_SECRET,
    { expiresIn: access_t?access_TTL:refresh_TTL})

const add_cookie = (res, cookie_name, cookie) => {
    const cookieOptions = { httpOnly: true,
        secure: true,
        sameSite: 'Strict' }

    res.cookie(cookie_name, cookie, cookieOptions);
    return res
}


class UserControllers {

    static Register = (req, res, next) => {
        let { full_name, email, password } = req.body
        let { full_name, email, password } = req.body

        if (!emailValidator(email)) return res.status(400).json('Enter a valid email');
        email = email.toLowerCase()
        email = email.toLowerCase()

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
        console.log('Loggin in')
        const { email, password } = req.body



        if (!email || !password) return res.status(400).json('Please provide email and password')

        User.findOne({ email: email.toLowerCase() }).then(user => {
        User.findOne({ email: email.toLowerCase() }).then(user => {
            if (!user) return res.status(404).json('No account under this email')

            return user.matchPassword(password).then(isMatch => {
                if (!isMatch)return res.status(401).json('Incorrect email password combination')

                const userDetails = user.toObject()
                delete userDetails.password

                const access_token = gen_token(true, user)
                const refresh_token = gen_token(false, user)

                add_cookie(res, 'refreshToken', refresh_token).status(200).json({user: userDetails, token: access_token})
            })
        }).catch(error => {
            next(error)
        })
    }

    static RefreshToken = (req, res) => {
        const cookies = req.cookies
        console.log('cookies: ', cookies)
        console.log(cookies.refreshToken)
        jwt.verify(cookies.refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if(err) res.status(403).json(`Refresh token expired. Login again!${err}`)
            else res.status(200).json(gen_token(true, {_id: user.id, email: user.email}))
        })
    }

    static RegisterForm = (req, res) => {
        res.send(`
        <form action="/api/user/register" method="post">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username"/><br/>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password"/><br/>
            <input type="submit" value="Register"/>
        </form>
    `)

    }

}

module.exports = UserControllers