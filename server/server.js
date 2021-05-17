const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { DBconnection } = require("./config/databse");
DBconnection();
const authRouter = require("./api/auth/index");
const userRouter = require("./api/user/index");
const paymentRouter = require("./api/payment/index");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/auth", authRouter);
app.use("/users", userRouter);
app.use("/api/payment", paymentRouter);

// setting up Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on Port: ${PORT}`);
});
