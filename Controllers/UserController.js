const bcrypt = require("bcrypt")
const modelUser = require("../models/user")
const userService = require("../Services/UserService")

module.exports = {
    
    getUsers:  async (req, res)=>{
        const users = await userService.getUsers()
        res.json(users)
    },
    
    postUser:  async (req, res)=>{
        const user = req.body
        await userService.postUser(user)
        res.json("user was created")
    },
    
    getUserById: async (req, res)=>{
        let id = req.params._id
        let user = await userService.getUserById(id)
        res.json(user)
    },
    
    deleteUser: async (req, res)=>{
        let id = req.params.id
        let result = await userService.deleteUser(id)
        res.json(result)
    }
    
}