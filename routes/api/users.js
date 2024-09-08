const express = require("express");
const { v4: uuidv4 } = require("uuid");
const User = require("../../models/user");
const sendEmail = require("../../utils/sendEmail");
const auth = require("../../middleware/auth");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

const router = express.Router();

// Rejestracja użytkownika
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const verificationToken = uuidv4(); // Generowanie unikalnego tokena weryfikacyjnego
    console.log("Generated verification token:", verificationToken);
    const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });

    // Wysyłanie e-maila weryfikacyjnego
    const verifyLink = `${req.protocol}://${req.get(
      "host"
    )}/api/users/verify/${verificationToken}`;
    await sendEmail(
      email,
      "Verify your email",
      `Click the link to verify your email: ${verifyLink}`
    );

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Weryfikacja e-maila
router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
});

// Ponowne wysłanie e-maila weryfikacyjnego
router.post("/verify", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Missing required field email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    const verifyLink = `${req.protocol}://${req.get("host")}/api/users/verify/${
      user.verificationToken
    }`;
    await sendEmail(
      user.email,
      "Verify your email",
      `Click the link to verify your email: ${verifyLink}`
    );

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
