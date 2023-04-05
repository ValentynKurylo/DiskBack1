const {Schema, model} = require("mongoose")

const User = new Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    diskSpace: {type: Number, default: 1024**3},
    usedSpace: {type: Number, default: 0},
    avatar: {type: String},
    role: {type: String, default: "user"},
    files: [{type: Object, ref: "File"}]
})

module.exports = model('User', User)