const express = require("express");
const Router = express.Router();
const { verifyUser } = require("../../helper/verifyUser");
const {
  handleInitiatePayment,
  handlePaymentNotification,
} = require("../payment/payment_middlewares");

// GET /api/payment/initiate
Router.post("/initiate", verifyUser, handleInitiatePayment);

// GET /api/payment/notification
Router.post("/notification", handlePaymentNotification);

module.exports = Router;
