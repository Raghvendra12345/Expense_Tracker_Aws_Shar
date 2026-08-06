const ForgotPassword = require("../models/forgotPasswordModel");
const User = require("../models/userModel");
const crypto = require("crypto");
const {sendResetEmail}=require("../services/mailService")
const bcrypt = require("bcrypt");
const path = require("path");


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const uuid = crypto.randomUUID()
      await ForgotPassword.create({
        uuid: uuid,
        userId: user.id,
        isActive: true,
      });
      await sendResetEmail(email, uuid);
    
    res
      .status(200)
      .json({ message: "Password reset link has been sent to your email." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }

  
};


const resetPasswordPage = async (req, res) => {

    try {

        const uuid = req.params.uuid;

        const request = await ForgotPassword.findOne({
            where: {
                uuid: uuid,
                isActive: true
            }
        });

        if (!request) {

            return res.status(404).send("Reset link expired or invalid.");

        }

        res.sendFile(
            path.join(__dirname, "..", "views", "resetPassword.html")
        );

    }

    catch (err) {

        console.log(err);

        res.status(500).send("Server Error");

    }

};

const updatePassword = async (req, res) => {

    try {

        const uuid = req.params.uuid;

        const { password } = req.body;

        const request = await ForgotPassword.findOne({

            where: {
                uuid,
                isActive: true
            }

        });

        if (!request) {

            return res.status(400).json({
                message: "Reset link expired."
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 20);

        const user = await User.findByPk(request.userId);

        user.password = hashedPassword;

        await user.save();

        request.isActive = false;

        await request.save();

        res.json({
            message: "Password updated successfully."
        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};

module.exports = { forgotPassword ,resetPasswordPage , updatePassword};
