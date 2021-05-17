const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    payment: [{ type: ObjectId, ref: "payments" }],
    verification_token: {
      type: String,
    },
    verification_token_expires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamp: true }
);

const paymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: ObjectId,
      ref: "users",
    },
    status: {
      type: String,
    },
    reference: {
      type: String,
    },
    payment_info: {
      type: Object,
    },
  },
  { timestamp: true }
);

exports.UserModel = mongoose.model("users", userSchema);
exports.PaymentModel = mongoose.model("payments", paymentSchema);
