const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db"); // Import konfiguracji połączenia do MongoDB
const usersRouter = require("./routes/api/users"); // Trasy dla użytkowników
const contactsRouter = require("./routes/api/contacts"); // Trasy dla kontaktów

const app = express();

// Połączenie z bazą danych MongoDB
connectDB();

// Middleware
app.use(logger("dev")); // Logowanie zapytań HTTP
app.use(cors()); // Pozwolenie na CORS
app.use(express.json()); // Parsowanie zapytań JSON

// Trasy
app.use("/api/users", usersRouter); // Trasy dla użytkowników
app.use("/api/contacts", contactsRouter); // Trasy dla kontaktów

// Middleware do obsługi błędów
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

module.exports = app;
