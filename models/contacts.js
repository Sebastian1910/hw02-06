const Contact = require("./contact");

const listContacts = async (filter) => {
  try {
    const contacts = await Contact.find(filter).populate(
      "owner",
      "email subscription"
    );
    return contacts;
  } catch (error) {
    console.error("Error listing contacts:", error.message);
    throw error;
  }
};

const getContactById = async (contactId, owner) => {
  try {
    const contact = await Contact.findOne({ _id: contactId, owner });
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

const removeContact = async (contactId, owner) => {
  try {
    const contact = await Contact.findOneAndRemove({ _id: contactId, owner });
    return contact || null;
  } catch (error) {
    console.error(
      `Error removing contact with ID ${contactId}:`,
      error.message
    );
    throw error;
  }
};

const updateContact = async (contactId, body, owner) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
      body,
      { new: true }
    );
    return contact || null;
  } catch (error) {
    console.error(
      `Error updating contact with ID ${contactId}:`,
      error.message
    );
    throw error;
  }
};

const updateStatusContact = async (contactId, body, owner) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
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
