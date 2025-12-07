const { randomBytes } = require("crypto");

function generateApiKey(length = 32) {
  return (
    "dp_" +
    randomBytes(length)
      .toString("base64url")
      .replace(/-/g, "")
      .replace(/_/g, "")
      .substring(0, 43)
  );
}

module.exports = {
  generateApiKey,
};
