const express = require("express");
const { v4: uuidv4 } = require("uuid");
const User = require("../../models/user");
const sendEmail = require("../../utils/sendEmail");
const auth = require("../../middleware/auth");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

const router = express.Router();

// Schematy walidacyjne Joi
const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const resendSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Rejestracja użytkownika
router.post("/signup", async (req, res, next) => {
  try {
    // Walidacja danych rejestracyjnych
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    // Sprawdzenie, czy e-mail jest już używany
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    // Generowanie tokena weryfikacyjnego
    const verificationToken = uuidv4();
    console.log("Generated verification token:", verificationToken);

    // Tworzenie awatara i hashowanie hasła
    const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzenie nowego użytkownika
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

    // Zwracanie odpowiedzi po pomyślnej rejestracji
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    next(error);
  }
});

// Weryfikacja e-maila
router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    // Sprawdzenie, czy użytkownik został znaleziony
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ustawianie flagi weryfikacji i usunięcie tokena
    user.verify = true;
    user.verificationToken = null;
    await user.save();

    // Zwrócenie sukcesu po weryfikacji
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error("Error during email verification:", error);
    next(error);
  }
});

// Ponowne wysłanie e-maila weryfikacyjnego
router.post("/verify", async (req, res, next) => {
  try {
    // Walidacja e-maila
    const { error } = resendSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    // Sprawdzenie, czy użytkownik istnieje
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sprawdzenie, czy użytkownik już został zweryfikowany
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    // Sprawdzenie, czy token weryfikacyjny istnieje
    if (!user.verificationToken) {
      return res.status(400).json({
        message: "Verification token not available. Please re-register.",
      });
    }

    // Wysyłanie ponownie e-maila weryfikacyjnego
    const verifyLink = `${req.protocol}://${req.get("host")}/api/users/verify/${
      user.verificationToken
    }`;
    await sendEmail(
      user.email,
      "Verify your email",
      `Click the link to verify your email: ${verifyLink}`
    );

    // Zwracanie sukcesu po ponownym wysłaniu wiadomości
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Error during verification email resending:", error);
    next(error);
  }
});

module.exports = router;
