const nodemailer = require("nodemailer");
let APP_NAME;
let email_server;
let email_address;
let email_password;
const { verifyEmailTemplate } = require("./emailTemplate");

if (process.env.NODE_ENV === "production") {
  APP_NAME = process.env.APP_NAME;
  email_address = process.env.email_address;
  email_server = process.env.email_server;
  email_password = process.env.email_password;
} else {
  APP_NAME = require("../config/config").APP_NAME;
  email_server = require("../config/config").email_server;
  email_address = require("../config/config").email_address;
  email_password = require("../config/config").email_password;
}

exports.sendEmail = async (options) => {
  // assign the email temaplate to html

  options.input = verifyEmailTemplate(options);

  // create reusable transporter object using the default SMTP transport
  let Transporter = nodemailer.createTransport({
    service: email_server,
    host: email_server,
    port: 587,
    secure: false,

    auth: {
      user: email_address,
      pass: email_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const message = {
    from: `"${APP_NAME}" <${email_address}>`,
    to: options.to,
    subject: options.subject,
    html: options.input,
  };
  let info = await Transporter.sendMail(message)
    .then((res) => {
      console.log(`Email sent`);
    })
    .catch((err) => {
      console.log(`Error occured:`, err);
    });
};
