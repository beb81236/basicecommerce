const express = require("express");
const Router = express.Router();
const { verifyUser } = require("../../helper/verifyUser");
const { handleInitiatePayment } = require("../payment/payment_middlewares");

// GET /api/payment/initiate
Router.post("/initiate", verifyUser, handleInitiatePayment);

// GET /api/payment/notification
// Router.post("/notification");

module.exports = Router;
