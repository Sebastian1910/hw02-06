const express = require("express");
const auth = require("../../middleware/auth"); // Middleware do autoryzacji
const Contact = require("../../models/contact");
const router = express.Router();

// Pobieranie kontaktów z paginacją i filtrowaniem
router.get("/", auth, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, favorite } = req.query; // Paginacja i filtrowanie
    const filter = { owner: req.user._id };

    if (favorite) {
      filter.favorite = favorite === "true"; // Filtrowanie po ulubionych
    }

    const contacts = await Contact.find(filter)
      .skip((page - 1) * limit) // Paginacja
      .limit(Number(limit)); // Limit kontaktów na stronę

    res.status(200).json({ contacts });
  } catch (error) {
    next(error); // Przekazywanie błędów
  }
});

// Dodawanie nowego kontaktu
router.post("/", auth, async (req, res, next) => {
  try {
    const newContact = await Contact.create({
      ...req.body,
      owner: req.user._id,
    }); // Tworzenie kontaktu
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

// Usuwanie kontaktu
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
