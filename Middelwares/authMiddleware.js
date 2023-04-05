const jwt = require('jsonwebtoken')

const userService = require("../Services/UserService")

module.exports = {
    isAuth: (req, res, next)=>{
        if (req.method === 'OPTIONS') {
            return next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(200).json({message: 'Auth error'})
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decoded
            next()
        } catch (e) {
            return res.status(200).json({message: 'Auth error'})
        }
    }
}