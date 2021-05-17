const Axios = require("axios");
const Crypto = require("crypto");
const { UserModel } = require("../../models/Index");
let FLUTTERWAVE_PUBLIC_KEY;
let FLUTTERWAVE_SECRETE_KEY;

if (process.env.NODE_ENV === "production") {
  APP_NAME = process.env.APP_NAME;
  FLUTTERWAVE_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY;
  FLUTTERWAVE_SECRETE_KEY = process.env.FLUTTERWAVE_SECRETE_KEY;
} else {
  FLUTTERWAVE_SECRETE_KEY =
    require("../../config/config").FLUTTERWAVE_SECRETE_KEY;
  FLUTTERWAVE_PUBLIC_KEY =
    require("../../config/config").FLUTTERWAVE_PUBLIC_KEY;
}

exports.handleInitiatePayment = async (req, res, next) => {
  try {
    //   get the amount the user is trying to pay
    const { amount } = req.body;
    // amount validation
    // check for alphabet,spaces and ay kinf of digit or symbol
    const amountAlpha = amount.match(/[a-zA-Z]/g);
    const amountSpace = amount.match(/\s/g);
    const amountDigit = amount.match(/\D/g);

    if (!amount || amountAlpha || amountDigit || amountSpace) {
      return res.status(400).json({ message: `Bad Reqeust` });
    }

    //   get user
    let user = await UserModel.findById(req.user._id);

    // Flutter wave payload format
    let data = {
      tx_ref: Crypto.randomBytes(16).toString("hex"),
      amount: amount,
      currency: "NGN",
      redirect_url: "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
      payment_options: "card",
      meta: {
        consumer_id: user._id,
      },
      customer: {
        email: user.email,
      },
      customizations: {
        title: "Basic Ecommerce Payments",
        description: "Middleout isn't free. Pay the price",
        logo: "https://assets.piedpiper.com/logo.png",
      },
    };

    // request config
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FLUTTERWAVE_SECRETE_KEY}`,
      },
    };

    // convert the body from string to json format
    const body = JSON.stringify(data);

    // After collecting payment details, initiate the payment by calling our API with the collected payment details
    let response = await Axios.post(
      "https://api.flutterwave.com/v3/payments",
      body,
      config
    );
    console.log(response);
    response = response.data;
    res
      .status(200)
      .json({ status: response.status, paymentLink: response.data.link });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
