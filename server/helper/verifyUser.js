const jwt = require("jsonwebtoken");

exports.verifyUser = async (req, res, next) => {
  try {
    const token = req.header("X-AUTH-TOKEN");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied", code: 401 });
    } else {
      if (token) {
        try {
          const decoded = jwt.verify(token, "secret");
          req.user = decoded;
          next();
        } catch (error) {
          console.log(error);
          return res.status(498).json({ message: "Invalid Token" });
        }
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};
