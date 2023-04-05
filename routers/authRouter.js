const router = require("express").Router()

const authController = require("../Controllers/authController")
const authMiddleware = require("../Middelwares/authMiddleware")

router.post('/registration', authController.registration)

router.post('/login', authController.login)

router.get('/', authMiddleware.isAuth, authController.auth)

module.exports = router