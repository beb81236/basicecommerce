const express = require("express");
const Router = express.Router();
const { handleGetUserDetails } = require("./user_middlewares");
const { verifyUser } = require("../../helper/verifyUser");

// GET /users/me
Router.get("/me", verifyUser, handleGetUserDetails);

module.exports = Router;

// https://github.com/sendgrid/email-templates/blob/master/paste-templates/email-confirmation.html
