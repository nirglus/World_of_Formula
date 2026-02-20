const { Item } = require("../models/item.model");
const { Stealer } = require("../models/stealer.model");

const updateClientType = async (req, res) => {
  // ...existing code...
};

/**
 * Update the type of a credential in the data.credentials array.
 * @param {Object} req.body - {
 *   stealerId: String,
 *   login: String,
 *   url_stripped: String,
 *   newType: String ('client' or 'employee')
 * }
 */
const updateCredentialType = async (req, res) => {
  try {
    const { stealerId, login, url_stripped, newType } = req.body;

    // Update the credential type where login and url_stripped match
    const result = await Stealer.updateOne(
      { _id: stealerId, "data.credentials.data.login": login, "data.credentials.data.url_stripped": url_stripped },
      {
        $set: {
          "data.credentials.$[cred].type": newType
        }
      },
      {
        arrayFilters: [
          { "cred.data.login": login, "cred.data.url_stripped": url_stripped }
        ]
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Credential not found or already set." });
    }

    res.json({ message: "Credential type updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  updateClientType,
  updateCredentialType
};