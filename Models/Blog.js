const { model, Schema} = require("mongoose");

const BlogSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    backdrop: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Users"

    },
    posted_Date: {
        type: Date,
        default: Date.now,

    },
    Tags: [
        {
            type: String,
            required: true
        }],
    
    categories: [{ type: String, required: true },],
    comments:[{type:Schema.Types.ObjectId,ref:"Comments"}]



});

module.exports = model("Blog", BlogSchema);