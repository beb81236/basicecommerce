const express = require("express");
const Router = express.Router();
const {
  handleAccountVerfication,
  handleUserLogin,
  handleUserRegistration,
} = require("./auth_middlewares");

// POST api/auth/register
Router.post("/register", handleUserRegistration);

// POST api/auth/login
Router.post("/login", handleUserLogin);

// POST api/auth/register
Router.post("/verifyemail/:token", handleAccountVerfication);

module.exports = Router;
