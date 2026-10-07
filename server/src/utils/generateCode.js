import crypto from "crypto";

/**
 * Generate a 6 character long unqiue short code for URLs. code must contain only alphanumeric characters (A-Z, a-z, 0-9)
 * @returns {string} - A 6 character long unique short code
 *
 */

const generateCode = () => {
  return crypto.randomBytes(3).toString("hex");
};

export default generateCode;
