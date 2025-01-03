// Function to generate a deterministic substitution key (based on a static value)
function generateDeterministicKey(seed = 'staticSeed123') {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  const usedChars = new Set();

  for (let i = 0; i < seed.length; i++) {
    const index = (seed.charCodeAt(i) + i) % characters.length;
    const char = characters[index];
    if (!usedChars.has(char)) {
      key += char;
      usedChars.add(char);
    }
  }

  // If the key length is shorter than required, fill it up
  while (key.length < characters.length) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const char = characters[randomIndex];
    if (!usedChars.has(char)) {
      key += char;
      usedChars.add(char);
    }
  }

  return key;
}

// Generate a deterministic substitution key based on the static seed
const key = generateDeterministicKey();
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

// Export the functions to use in other files
module.exports = { generateRandomId, EncryptionCode, DecryptionCode };
