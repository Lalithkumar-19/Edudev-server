const { model, Schema, default: mongoose } = require("mongoose");
const CartSchema = new Schema({
    cart_products_details: [{
        Cart_product: { type: mongoose.Schema.Types.ObjectId, ref: "Books" }
    }],
    quantity: { type: Number, default: 1 },

})





module.exports = model("Cart", CartSchema);