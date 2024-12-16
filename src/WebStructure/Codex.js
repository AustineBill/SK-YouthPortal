// Predefined key for substitution
const key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Function to generate a random 8-digit number
function generateRandomId() {
  const randomNumber = Math.floor(Math.random() * 90000000) + 10000000; // Ensures it's an 8-digit number
  return randomNumber.toString();
}

// Function to encrypt the number
function EncryptionCode(number) {
  let encryptedString = '';
  for (let i = 0; i < number.length; i++) {
    const digit = parseInt(number[i], 10); // Get the numeric value of the digit
    encryptedString += key[digit]; // Map it to the key
  }
  return encryptedString;
}

// Function to decrypt the encrypted string back to the original number
function DecryptionCode(encryptedString) {
  let decryptedNumber = '';
  for (let i = 0; i < encryptedString.length; i++) {
    const char = encryptedString[i];
    const index = key.indexOf(char); // Find the index in the key
    decryptedNumber += index; // Append the corresponding digit
  }
  return decryptedNumber;
}

// Example usage
const originalId = generateRandomId();
//console.log('Original ID:', originalId);

const encryptedId = EncryptionCode(originalId);
//console.log('Encrypted ID:', encryptedId); //HGAHGCHG

const decryptedId = DecryptionCode(encryptedId);
//console.log('Decrypted ID:', decryptedId);

// Export the functions to use in other files
module.exports = { generateRandomId, EncryptionCode, DecryptionCode };
