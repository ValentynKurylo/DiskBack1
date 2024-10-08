const bcrypt = require("bcrypt")
const modelUser = require("../models/user")
const fileService = require("./fileService")
const fileModel = require("../models/fileModel")

module.exports = {
    async getUsers(){
        const users = await modelUser.find()
        return users
    },

    async postUser(user){
        try {
            let hashPassword = await bcrypt.hash(user.password, 6)
            user.password = hashPassword
            const newUser = new modelUser(user)
            await newUser.save()
            await fileService.createDir(new fileModel({user: newUser.id, name: ''}))
        } catch (e) {
            return {
                message: `Server Error: ${e}`,
                status: 500
            }
        }
    },
    
    async getUserById(id){
        try {
            let user = await modelUser.findById(id)
            return user
        } catch (e) {
            return {
                message: `Server Error: ${e}`,
                status: 500
            }
        }
    },
    
    async getUserByEmail(email){
        try {
            const user = await modelUser.findOne({email})
            return user
        } catch (e) {
            return {
                message: `Server Error: ${e}`,
                status: 500
            }
        }
    },
    
    async deleteUser(id){
        try {
            await modelUser.remove({_id: id})
            return {
                message: "User was deleted",
                status: 200
            }
        } catch (e) {
            return {
                message: `Server Error: ${e}`,
                status: 500
            }
        }
    }
}