const {Schema, model} = require("mongoose");

const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    anime: { type: Schema.Types.ObjectId, ref: 'Anime', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Comment = model("Comment", commentSchema)

module.exports = Comment;