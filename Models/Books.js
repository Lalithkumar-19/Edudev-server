const { Schema, model, default: mongoose } = require("mongoose");
const BookSchema = new Schema({
    title: { type: String, required: true },
    Author: { type: String, required: true },
    description: { type: String, required: true },
    Additional_info: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    book_pics: [{ type: String, required: true, minlength: 1 }],
    book_price: { type: String, required: true },
    book_actual_price: { type: String, required: true },
    book_sub_title: { type: String, required: true },
    In_stock: { type: String, required: true },
    tags: [{ type: String, required: true }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Instructor" }
});



module.exports = model("Book", BookSchema);