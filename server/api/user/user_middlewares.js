const { UserModel } = require("../../models/Index");
exports.handleGetUserDetails = async (req, res, next) => {
  try {
    let user = await UserModel.findById(req.user._id).populate("payment");
    let apiResponse = {
      email: user.email,
      payments: user.payment,
      isVerfied: user.isVerified,
    };
    res.status(200).json({ message: apiResponse });
  } catch (error) {
    console.log(error);
  }
};
