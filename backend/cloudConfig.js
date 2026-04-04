const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { CLOUDINARY } = require("./config/env");

cloudinary.config({
  cloud_name: CLOUDINARY.cloudName,
  api_key: CLOUDINARY.apiKey,
  api_secret: CLOUDINARY.apiSecret,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "agriconnectai/listings",
    allowed_formats: ["png", "jpg", "jpeg", "webp"],
    transformation: [{ width: 1600, crop: "limit" }],
  }),
});

module.exports = { cloudinary, storage };
