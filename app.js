const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Importujemy logikę do obsługi MongoDB

// Ładowanie zmiennych środowiskowych z pliku .env
dotenv.config();

// Trasy
const usersRouter = require("./routes/api/users");
const contactsRouter = require("./routes/api/contacts");

// Tworzenie aplikacji Express
const app = express();

// Połączenie z MongoDB
connectDB(); // Teraz MongoDB jest zarządzane z osobnego pliku

// Ustawienia logowania dla różnych środowisk (development/production)
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// Middleware
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// Serwowanie statycznych plików z folderu "public"
app.use(express.static("public"));

// Rejestrowanie tras użytkowników i kontaktów
app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter); // Trasy kontaktów

// Obsługa błędu 404
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Middleware obsługi błędów
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

module.exports = app;
