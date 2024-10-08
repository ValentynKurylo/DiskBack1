const fileService = require("../Services/fileService")
const fileModel = require("../models/fileModel")

module.exports = {
    createDir: async (req, res)=>{
        const {name, type, parent} = req.body
        const user = req.user
        try {
            const file = new fileModel({name, type, parent, user: user.id})
            const parentFile = await fileModel.findOne({_id: parent})
            if(!parentFile){
                file.path = name
                await fileService.createDir(file)
                
            }else {
                file.path = `${parentFile.path}\\${file.name}`
                await fileService.createDir(file)
                parentFile.childs.push(file._id)
                await parentFile.save()
            }
            await file.save()
            res.json(file)

        } catch (e) {
            res.json({
                message: "Something wrong",
                status: 500
            })
        }
    },
    getFiles: async (req, res) => {
        const userId = req.user.id
        const sort = req.query.sort
        const parent = req.query.parent
        const files = await fileService.getFiles(userId, sort, parent)
        res.json(files)
    },
    
    getFilesById: async (req, res)=>{
        const id = req.query.parent
        const userId = req.user.id
        const files = await fileService.getFilesById(id, userId)
        res.json(files)
    },

    searchFiles: async (req, res)=>{
        const userId = req.user.id
        const name = req.query.search
        const parent = req.query.parent
        const files = await fileService.searchFiles(name, userId, parent)
        res.json(files)
    },

    fileUpload: async (req, res)=>{
        const file = req.files.file
        const userId = req.user.id
        const parent = req.body.parent
        const result = await fileService.fileUpload(file, userId, parent)
        res.json(result)
    },

    downloadFile: async (req, res)=>{
        const id = req.query.id
        const userId = req.user.id
        const result = await fileService.downloadFile(id, userId)
        res.download(result.path, result.name)
    },

    deleteFile: async (req, res)=>{
        const id = req.query.id
        const user = req.user.id
        const result = await fileService.deleteFile(id, user)
        res.json(result)
    },

    avatarUpload: async (req, res)=>{
        true_mimetypes = ["jpg", "tiff", "png", "jpeg", "bpm", "tif", "svg"]
        const file = req.files.file
        mimetypes = file.name.split('.')
        mimetype = mimetypes[mimetypes.length - 1]
        if (true_mimetypes.includes(mimetype)) {
            const userId = req.user.id
            const result = await fileService.avatarUpload(file, userId)
            res.json(result)
        }
        else{
            res.status(400).json("Wrong format")
        }
    },
    avatarDelete: async (req, res)=>{
        const id = req.user.id
        const result = await fileService.avatarDelete(id)
        res.json(result)
    }
    
}