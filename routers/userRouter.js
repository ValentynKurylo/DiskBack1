const router = require("express").Router()

const userController = require("../Controllers/UserController")
const authMiddleware = require("../Middelwares/authMiddleware")

router.get('/', userController.getUsers)

router.post('/', userController.postUser)

router.get('/currentUser', userController.getUserById)

router.delete('/:id', userController.deleteUser)

module.exports = router