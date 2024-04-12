const { model, Schema, default: mongoose } = require("mongoose");
const ReviewsSchema = new Schema({
    reviwer_details: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    review_content: { type: String, required: true },
    rating: { type: Number, required: true }

})





module.exports = model("Reviews", ReviewsSchema);