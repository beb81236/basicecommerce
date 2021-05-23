const { UserModel } = require("../../models/Index");
const bcrypt = require("bcryptjs");
const JWToken = require("jsonwebtoken");
const Crypto = require("crypto");
const { sendEmail } = require("../../misc/index");

exports.handleUserRegistration = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }

    const checkEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (!checkEmail) {
      return res.status(400).json({ message: "Invalid email." });
    }

    // check if user exist
    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(401).json({ message: "User exist" });
    }

    // Hash a password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Generate Verifcation token
    const verification_token = Crypto.randomBytes(16).toString("hex");

    // New user
    const newUser = new UserModel({
      email,
      password: hash,
      verification_token,
      verification_token_expires: Date.now() + 10 * 60 * 1000 * 72,
      // 72 hours, 3 days
    });

    // create new user and send a response
    await newUser.save();
    res.status(201).json({ message: "registration successful" });

    // options
    let options = {
      to: email,
      subject: "Verify your Email address",
      link: `http://localhost:3000/verifyemail/${verification_token}`,
    };

    // send verification tokens to user
    return await sendEmail(options);
  } catch (error) {
    console.log(error);
  }
};

exports.handleAccountVerfication = async (req, res, next) => {
  try {
    //   extract the validation token from the params
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // find the user with the token and also check if it has not expired
    const user = await UserModel.findOne({
      verification_token: token,
      verification_token_expires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(498).json({
        message: "invalid token or expired token ",
      });
    }

    // verify user and null other values
    user.isVerified = true;
    user.verification_token = null;
    user.verification_token_expires = null;

    await user.save();
    return res.status(200).json({ message: `user has been verified` });
  } catch (error) {
    console.log(error);
  }
};

exports.handleUserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    // find user
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    // check to see if a user is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your account." });
    }

    // Match password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }
    // Generate token
    const token = JWToken.sign({ _id: user._id }, "secret", {
      expiresIn: 60 * 1000 * 60 * 48,
    });
    return res.status(200).json({ message: token });
  } catch (error) {
    console.log(error);
  }
};
