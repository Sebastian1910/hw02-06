const Contact = require("./contact"); // Import modelu

const listContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error("Error listing contacts:", error.message);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact || null;
  } catch (error) {
    console.error(`Error getting contact with ID ${contactId}:`, error.message);
    throw error;
  }
};

const addContact = async (body) => {
  try {
    const newContact = new Contact(body);
    await newContact.save();
    return newContact;
  } catch (error) {
    console.error("Error adding contact:", error.message);
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const contact = await Contact.findByIdAndRemove(contactId);
    return contact || null;
  } catch (error) {
    console.error(
      `Error removing contact with ID ${contactId}:`,
      error.message
    );
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contact = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    return contact || null;
  } catch (error) {
    console.error(
      `Error updating contact with ID ${contactId}:`,
      error.message
    );
    throw error;
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite: body.favorite },
      { new: true }
    );
    return contact || null;
  } catch (error) {
    console.error(
      `Error updating favorite status for contact with ID ${contactId}:`,
      error.message
    );
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
