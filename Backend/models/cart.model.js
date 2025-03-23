const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    quantity: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;
