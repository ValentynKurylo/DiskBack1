const fs = require("fs")
const Path = require("path")
const uuid = require("uuid")

const fileModel = require("../models/fileModel")
const userModel = require("../models/user")
const userService = require("./UserService")

module.exports = {
    async createDir(file){
        let filePath = `${process.env.FILE_PATH}\\${file.user}\\${file.path}`
        //let filePath = Path.resolve(process.env.FILE_PATH, file.user, file.path)
        try {
            if(!fs.existsSync(filePath)){
                fs.mkdirSync(filePath)
                return {
                    message: "File was added",
                    status: 200
                }
            }
            else{
                return {
                    message: "File already exist",
                    status: 400
                }
            }
        }
        catch (e){
            console.log(e)
            return {
                message: "Something wrong",
                status: 500
            }
        }
    },
    async getFiles(userId, sort, parent){
        switch (sort) {
            case 'name':
                files = await fileModel.find({user: userId, parent: parent}).sort({name:1})
                break
            case 'type':
                files = await fileModel.find({user: userId, parent: parent}).sort({type:1})
                break
            case 'date':
                files = await fileModel.find({user: userId, parent: parent}).sort({date:1})
                break
            default:
                files = await fileModel.find({user: userId, parent: parent})
                break;
        }
        return files
    },

    async searchFiles(name, userId, parent){
        let files = await fileModel.find({user: userId, parent: parent})
        files = files.filter(file=>file.name.includes(name))
        return files
    },
    
    async getFilesById(id, userId){
        const files = await fileModel.find({parent: id, user: userId})
        return files
    },

    async fileUpload(file, userId, parent1){
        try {
            const parent = await fileModel.findOne({user: userId, _id: parent1})
            const user = await userModel.findOne({_id: userId})
            if(user.usedSpace + file.size > user.diskSpace){
                return {
                    message: "There is no space on the disk",
                    status: 400
                }
            }

            user.usedSpace += file.size
            let path
            if(parent){
                path = `${process.env.FILE_PATH}\\${user._id}\\${parent.path}\\${file.name}`
            }else {
                path = `${process.env.FILE_PATH}\\${user._id}\\${file.name}`
            }

            if(fs.existsSync(path)){
                return {
                    message: "Such file is alreadu exist",
                    status: 400
                }
            }

            file.mv(path)
            const type = file.name.split('.').pop()
           let filePath = file.name
            if(parent){
                console.log(parent.path)
                filePath = parent.path + '\\' + file.name
            }
            const dbFile = new fileModel({
                name: file.name,
                type: type,
                size: file.size,
                path: filePath,
                parent: parent?._id,
                user: user._id
            })

            dbFile.save()
            user.save()
            return {
                file: dbFile,
                message: "File was uploaded",
                status: 200
            }
        }
        catch (e){
            return {
                message: "Something wrong",
                status: 500
            }
        }
    },

    async downloadFile(id, userId){
        try {
            const file = await fileModel.findOne({_id: id, user: userId})
            const path = process.env.FILE_PATH + '\\' + userId + '\\' + file.path
            //const path = Path.resolve(process.env.FILE_PATH, userId, file.path, file.name)
            if(fs.existsSync(path)){
                return {
                    "path": path,
                    "name": file.name,
                    "status": 200
                }
            }
            else {
                return {
                    message: "Download error",
                    status: 400
                }
            }
        }catch (e){
            return {
                message: "Something wrong",
                status: 500
            }
        }
    },

    deleteFileFromServer(file){
        console.log('ffffffffffffff', process.env.FILE_PATH,  file.user, file.path)
        //const path = Path.resolve(process.env.FILE_PATH, file.user, file.path)
        const path = process.env.FILE_PATH + '\\' + file.user + '\\' + file.path
        console.log(path)
        if(file.type === "dir"){
            fs.rmdirSync(path)
        }else{
            fs.unlinkSync(path)
        }
    },

    async deleteFile(id, userId){
        try {
            const file = await fileModel.findOne({_id: id, user: userId})
            const user = await userModel.findById(userId)
            if(!file){
                return {
                    message: "Such file is not found",
                    status: 400
                }
            }
            this.deleteFileFromServer(file)
            user.usedSpace -= file.size
            user.save()
            await file.remove()
            return {
                message: "File was deleted",
                status: 200
            }
        } catch (e) {
            console.log(e)
            return {
                message: "This dir is not emty",
                status: 500
            }
        }
    },

    async avatarUpload(file, id) {
        try {
            const user = await userModel.findById(id)
            const avatarName = uuid.v4() + ".jpg"
            const avatarPath = Path.join(process.env.STATIC, avatarName)
            file.mv(avatarPath)
            user.avatar = avatarName
            user.save()
            return user
        } catch (e) {
            console.log(e)
            return {
                message: "Avatar upload error",
                status: 500
            }
        }
    },
    async avatarDelete(id) {
        try {
            const user = await userModel.findById(id)
            fs.unlinkSync(Path.resolve(process.env.STATIC, user.avatar))
            user.avatar = null
            user.save()
            return user
        } catch (e) {
            console.log(e)
            return {
                message: "Avatar delete error",
                status: 500
            }
        }
    }
}