const jwt = require('jsonwebtoken');

const secretKey = 'your_secret_key';

// Function to generate a token
function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

// Function to verify a token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

// Example usage
// const payload = { userId: 123, username: 'exampleUser' };
// const token = generateToken(payload);
// console.log('Generated Token:', token);

// const verificationResult = verifyToken(token);
// console.log('Verification Result:', verificationResult);

module.exports = {
  generateToken,
  verifyToken,
};
