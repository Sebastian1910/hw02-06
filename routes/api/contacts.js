const express = require("express");
const auth = require("../../middleware/auth");
const Contact = require("../../models/contact");
const router = express.Router();

// Pobieranie wszystkich kontaktów (GET /api/contacts)
router.get("/", auth, async (req, res, next) => {
  try {
    const contacts = await Contact.find({ owner: req.user._id });
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

// Dodawanie nowego kontaktu (POST /api/contacts)
router.post("/", auth, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const contact = await Contact.create({
      ...req.body,
      owner: req.user._id,
    });
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

// Pobieranie kontaktu po ID (GET /api/contacts/:id)
router.get("/:id", auth, async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact || contact.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
