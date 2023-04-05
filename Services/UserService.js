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
        let hashPassword = await bcrypt.hash(user.password, 6)
        user.password = hashPassword
        const u = new modelUser(user)
        await u.save()
        await fileService.createDir(new fileModel({user: u.id, name: ''}))
    },
    
    async getUserById(id){
        let user = await modelUser.findById(id)
        return user
    },
    
    async getUserByEmail(email){
        const user = await modelUser.findOne({email})
        return user
    },
    
    async deleteUser(id){
        try {
            await modelUser.remove({_id: id})
            return {
                message: "User was deleted",
                status: 200
            }
        } catch (e) {
            console.log(e)
            return {
                message: "Something wrong",
                status: 400
            }
        }
    }
}