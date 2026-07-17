const jwt = require("jsonwebtoken");

// Creates a signed JWT containing the user's id and role.
// The token expires in 30 days - the frontend stores it and sends it
// on every request that needs authentication.
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = generateToken;
