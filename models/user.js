const mongoose = require("mongoose");

// Schemat użytkownika
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // Email musi być unikalny
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"], // Możliwe wartości subskrypcji
    default: "starter", // Domyślna subskrypcja to 'starter'
  },
  token: {
    type: String,
    default: null, // Token JWT, null gdy użytkownik nie jest zalogowany
  },
});

const User = mongoose.model("User", userSchema); // Tworzenie modelu na podstawie schematu

module.exports = User;
