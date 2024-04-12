const { Schema, model, default: mongoose } = require("mongoose");

const OrdersSchema = new Schema({
    userId: { type:Schema.Types.ObjectId,ref:"Users",required:true},
    customerId: { type: String},
    paymentIntentId:{type:String},
    products: [
        {
            name: { type: String, required: true },
            product_Id: { type: Schema.Types.ObjectId, ref: "Books" },
            quantity: { type: Number, required: true },

        }
    ],
    subtotal: { type: Number, required: true },
    shipping: { type: Object, required: true },
    delivery_status: { type: String, default: "pending" },
    payment_status: { type: String, required: true },

}, { timestamps: true });

module.exports = model("Orders", OrdersSchema);