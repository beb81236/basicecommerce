const mongoose = require("mongoose");

// switch FB in production
process.env.NODE_ENV !== "production"
  ? (URL = "mongodb://127.0.0.1:27017/basicecommerce")
  : (URL = process.env.MONGO_URI);

exports.DBconnection = async () => {
  const conn = await mongoose
    .connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log(`Database is now connected`);
    })
    .catch((err) => {
      console.log(err);
    });
};
