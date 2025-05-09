const app = require("./app"); // Import aplikacji Express
const port = process.env.PORT || 3000; // Używanie portu z pliku .env lub 3000

// Uruchamianie serwera
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
