const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schemat kontaktów
const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"], // Nazwa jest wymagana
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false, // Domyślnie kontakt nie jest ulubiony
  },
  owner: {
    type: Schema.Types.ObjectId, // Referencja do modelu użytkownika
    ref: "User",
    required: true, // Każdy kontakt musi mieć właściciela
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
