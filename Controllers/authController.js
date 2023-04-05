const authService = require("../Services/authService")

module.exports = {
    registration: async (req, res)=>{
        const body = req.body
        const email = req.body.email
        const message = await authService.registration(body, email)
        res.json(message)
    },
    
    login: async (req, res)=>{
        const {email, password} = req.body
        const token = await authService.login(email, password)
        res.json(token)
    },

    auth: async (req, res)=>{
        const id = req.user.id
        const response = await authService.auth(id)
        res.json(response)
    }
}