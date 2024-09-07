const express = require("express");
const bcrypt = require("bcryptjs"); // Biblioteka do haszowania haseł
const jwt = require("jsonwebtoken"); // JWT do autoryzacji
const User = require("../../models/user");
const router = express.Router();

// Rejestracja użytkownika
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Haszowanie hasła
    const newUser = await User.create({ email, password: hashedPassword }); // Tworzenie użytkownika

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: "starter",
      },
    });
  } catch (error) {
    next(error); // Przekazywanie błędów do globalnego middleware błędów
  }
});

// Logowanie użytkownika
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
