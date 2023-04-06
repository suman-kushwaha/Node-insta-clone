const { model, Schema } = require('mongoose')

const postSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    PostImage: { type: String, required: true },
    location: { type: String, required: true }
})

module.exports = postModel = model('posts', postSchema)