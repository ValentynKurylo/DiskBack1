const router = require("express").Router()

const fileController = require("../Controllers/fileController")
const authMiddleware = require("../Middelwares/authMiddleware")

router.post('/', authMiddleware.isAuth, fileController.createDir)

router.post('/file', authMiddleware.isAuth, fileController.fileUpload)

router.get('/all/', authMiddleware.isAuth, fileController.getFiles)

router.get('/', authMiddleware.isAuth, fileController.getFilesById)

router.get('/download', authMiddleware.isAuth, fileController.downloadFile)

router.get('/search/', authMiddleware.isAuth, fileController.searchFiles)

router.post('/avatarUpload', authMiddleware.isAuth, fileController.avatarUpload)

router.delete('/avatarDelete', authMiddleware.isAuth, fileController.avatarDelete)

router.delete('/', authMiddleware.isAuth, fileController.deleteFile)

module.exports = router