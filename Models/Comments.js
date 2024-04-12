const { model, Schema, default: mongoose } = require("mongoose");
const CommentsSchema = new Schema({
    commenter_details: { type: Schema.Types.ObjectId, ref: "Users" },
    commented_content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    liked_users: [{ type: String, required: false, }],
    date: { type: String, default: Date.now().toString() },
}, { timestamps: true });





module.exports = model("Comments", CommentsSchema);