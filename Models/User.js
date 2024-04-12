const { model, Schema, default: mongoose } = require("mongoose");

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dp: {
        type: String,
        required: false,
        default: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    profession: {
        type: String,
        required: false,
        default: "Edudev user"
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    instructor: { type: Boolean, default: false },
    cart: [{
        product_details: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        quantity: { type: Number, default: 1 },
    }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Orders" }],
    Wishlist: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
    ],
    Addresses: { type: String, required: false },
    Blogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
    learnings: [{ type: Schema.Types.ObjectId, ref: "Courses" }],

},{timestamps:true});

module.exports = model("Users", UserSchema);