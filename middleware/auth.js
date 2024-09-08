const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware do autoryzacji JWT
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.replace("Bearer ", ""); // Usunięcie prefiksu "Bearer"
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Weryfikacja tokena
    const user = await User.findById(decoded.id); // Znalezienie użytkownika na podstawie ID z tokena

    if (!user || !user.token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user; // Zapisanie użytkownika w req
    next(); // Przejście do kolejnego middleware
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = auth;
