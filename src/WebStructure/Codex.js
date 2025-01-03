// Function to generate a random substitution key (letters and numbers)
function generateRandomKey() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomKey = '';
  const usedChars = new Set();

  while (randomKey.length < characters.length) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const char = characters[randomIndex];
    if (!usedChars.has(char)) {
      randomKey += char;
      usedChars.add(char);
    }
  }
  return randomKey;
}

// Generate a random substitution key
const key = generateRandomKey();
console.log('Generated Key:', key);

// Function to generate a random 8-digit number with a "WB" prefix
function generateRandomId() {
  const randomNumber = Math.floor(Math.random() * 90000000) + 10000000; // Ensures it's an 8-digit number
  return `WB-${randomNumber.toString()}`;
}

// Function to encrypt the number (excluding the "WB-" prefix)
function EncryptionCode(id) {
  const number = id.split('-')[1]; // Extract the number part
  let encryptedString = '';
  for (let i = 0; i < number.length; i++) {
    const digit = parseInt(number[i], 10); // Get the numeric value of the digit
    encryptedString += key[digit]; // Map to the corresponding random key character
  }
  return `WB-${encryptedString}`;
}

// Function to decrypt the encrypted string back to the original number
function DecryptionCode(encryptedId) {
  const encryptedString = encryptedId.split('-')[1]; // Extract the encrypted part
  let decryptedNumber = '';
  for (let i = 0; i < encryptedString.length; i++) {
    const char = encryptedString[i];
    const index = key.indexOf(char); // Find the index in the random key
    if (index === -1) {
      // Handle error case if character not found in the key
      throw new Error(`Decryption failed: Character '${char}' not found in key.`);
    }
    decryptedNumber += index.toString(); // Append the corresponding digit
  }
  return `WB-${decryptedNumber}`;
}

// Example usage
const originalId = generateRandomId();
console.log('Original ID:', originalId); // Example: WB-78302334

const encryptedId = EncryptionCode(originalId);
console.log('Encrypted ID:', encryptedId); // Example: WB-QWERTY

const decryptedId = DecryptionCode(encryptedId);
console.log('Decrypted ID:', decryptedId); // Example: WB-78302334

// Export the functions to use in other files
module.exports = { generateRandomId, EncryptionCode, DecryptionCode };
