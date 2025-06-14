// utils/cloudinary.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} path - Local file path
 * @returns {Promise<string>} - Secure URL of uploaded image
 */
async function uploadImage(path) {
  try {
    const uniquePublicId = `image_${Date.now()}`;
    const result = await cloudinary.uploader.upload(path, {
      public_id: uniquePublicId,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

module.exports = { uploadImage };
