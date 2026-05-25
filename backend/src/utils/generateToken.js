const jwt = require("jsonwebtoken");

/**
 * @param {{ id: string, role: string }} payload
 */
function generateToken(payload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id: payload.id, role: payload.role }, secret, {
    expiresIn,
  });
}

module.exports = { generateToken };
