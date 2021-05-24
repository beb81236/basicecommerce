const Axios = require("axios");
const Crypto = require("crypto");
const { UserModel, PaymentModel } = require("../../models/Index");
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
      redirect_url: "http://localhost:3000/user/dashboard",
      payment_options: "card",
      meta: {
        user_id: user._id,
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
    // console.log(response);
    response = response.data;
    res
      .status(200)
      .json({ status: response.status, paymentLink: response.data.link });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

// https://developer.flutterwave.com/docs/events
exports.handlePaymentNotification = async (req, res, next) => {
  try {
    res.sendStatus(200); //return a status code to FLW
    const mySecreteHash = "12345656hgngjngkg"; //must be the same hash with the one on the dashboard

    // get hash from the req.header
    const hash = req.headers["verif-hash"];
    if (!hash) {
      console.log("No Hash");
      return;
    }
    if (hash !== mySecreteHash) {
      console.log(`Unverifief transaction noticed`);
      return;
    }

    // retrieve request body/payment information
    const requestBody = req.body;

    // you might want to re-verify if the transaction is indeed legit
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FLUTTERWAVE_SECRETE_KEY}`,
      },
    };

    // https://developer.flutterwave.com/docs/transaction-verification
    let verification = await Axios.get(
      `https://api.flutterwave.com/v3/transactions/${requestBody.data.id}/verify`,
      config
    );

    verification = verification.data;
    // Verify the status of the transaction to be successful.
    if (verification.status !== "success") {
      // Not a valid transaction
      console.log("Not a valid transaction");
      return;
    }

    // Verify the transaction reference and Verify the currency to be the expected currency.
    if (
      requestBody.data.tx_ref !== verification.data.tx_ref ||
      verification.data.currency !== "NGN"
    ) {
      // Not a valid transaction
      console.log(`Not a legit transaction`);
      return;
    }
    const user = await UserModel.findById(verification.data.meta.user_id);
    if (!user) {
      console.log(`User not found`);
      return;
    }

    const newPayment = new PaymentModel({
      user_id: user._id,
      status: verification.data.status,
      reference: verification.data.tx_ref,
      payment_info: verification.data,
    });
    let payment = await newPayment.save();
    user.payment.push(payment._id);
    await user.save();
    console.log("Transaction completed");
  } catch (error) {
    console.log(error);
  }
};
