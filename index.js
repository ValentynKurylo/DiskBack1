require('dotenv').config()
const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const fileUpload = require("express-fileupload")

const userRouter = require("./routers/userRouter")
const authRouter = require("./routers/authRouter")
const fileRouter = require("./routers/fileRouter")

const app = express()

app.use(express.static('static'))
app.use(express.static('files'))
app.use(express.json())
app.use(cors())
app.use(fileUpload({}))

app.get('/', (req, res)=>{
res.json("hello world")
})

app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/file', fileRouter)

const start = async () =>{
    try{
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_CONECT)
        app.listen(Number(process.env.PORT), ()=>{
            console.log("Server started on port ", Number(process.env.PORT))
        })
    }
    catch (e){
        console.log(e)
    }
}

start()