const mongoose = require("mongoose");

// Funkcja do połączenia z MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1); // Zakończ aplikację, jeśli nie można połączyć się z bazą
  }
};

module.exports = connectDB;
