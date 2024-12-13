// Function to generate a random 8-digit number
function generateRandomId() {
    const randomNumber = Math.floor(Math.random() * 90000000) + 10000000; // Ensures it's an 8-digit number
    return randomNumber.toString();
  }
  
  // Function to encrypt the 8-digit number into a random string
  function EncryptionCode(number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?';
    let encryptedString = '';
  
    for (let i = 0; i < number.length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      encryptedString += characters[randomIndex];
    }
  
    return encryptedString;
  }
  
  // Function to decrypt the encrypted string back into the 8-digit number
  function DecryptionCode(encryptedString) {
    const digits = '0123456789';
    let decryptedNumber = '';
  
    // Extracts the digits from the encrypted string based on positions of digits
    for (let i = 0; i < encryptedString.length; i++) {
      if (digits.includes(encryptedString[i])) {
        decryptedNumber += encryptedString[i];
      }
    }
  
    return decryptedNumber;
  }
  
  // Export the functions to be used in other files
  module.exports = { generateRandomId, EncryptionCode, DecryptionCode };
  