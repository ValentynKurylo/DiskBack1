const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const modelUser = require("../models/user")

const userService = require("../Services/UserService")

module.exports = {
    async registration(user, email){
        try {
            const candidate = await userService.getUserByEmail(email)
            if (candidate) {
                return {
                    message: "User with such email already exist",
                    status: 400
                }
              
            }
            await userService.postUser(user)
            return {
                message: "Good, User was registred",
                status: 200
            }
        } catch (e) {
            console.log(e)
            return {
                message: "Server Error",
                status: 500
            }
        }
    },

    async login(email, password){
        try {
            const user = await userService.getUserByEmail(email)
            if (!user) {
                return {
                    message: "Wrong email or password",
                    status: 400
                }
            }
            const isPassword = await bcrypt.compare(password, user.password)
            if (!isPassword) {
                return {
                    message: "Wrong email or password",
                    status: 400
                }
            }
            const token = jwt.sign({
                id: user.id,
                name: user.fullName,
                role: user.role
            }, process.env.SECRET_KEY || "111", {expiresIn: "30m"})
            let currentUser = {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace
            }
            return {
                token: token,
                user: currentUser,
                status: 200
            }
        } catch (e) {
            console.log(e)
            return {
                message: "Wrong email or password",
                status: 500
            }
        }
    },

    async auth(id){
        try {
            const user = await modelUser.findOne({_id: id})
            const token = jwt.sign({
                id: user.id,
                role: user.role,
                fullName: user.fullName,
            }, process.env.SECRET_KEY, {expiresIn: "30m"})

            return {
                token: token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace
                },
                status: 200
            }
        } catch (e) {
            console.log(e)
            return {
                message: "Server Error",
                status: 500
            }
        }
    }
}