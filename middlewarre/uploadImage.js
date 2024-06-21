const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  cloud_name: "dqcags0nr",
  api_key: "163853889843489",
  api_secret: "BIynzq9qN0-TkQTbYgzwItPXAH4",
});

const uploadImages = async (req, res, next) => {
  try {
    const files = req.files;
    if (
      !files ||
      (Array.isArray(files) && files.length === 0) ||
      (typeof files === "object" && Object.keys(files).length === 0)
    ) {
      req.app.locals.fileUrls = [];
      return next();
    }

    const fileUrls = [];
    if (Array.isArray(files)) {
      for (const file of files) {
        const buffer = await sharp(file.buffer)
          .resize(700)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();
        const upload = await uploadToCloudinary(buffer);
        if (upload.secure_url) {
          fileUrls.push(upload.secure_url);
        } else {
          console.error("Error uploading file:", file.originalname);
        }
      }
    } else {
      const mediaUrls = [];
      const coverImages = [];
      const imageUrls = [];

      if (files.mediaUrls) {
        for (const file of files.mediaUrls) {
          const buffer = await sharp(file.buffer)
            .resize(700)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toBuffer();
          const upload = await uploadToCloudinary(buffer);
          if (upload.secure_url) {
            mediaUrls.push(upload.secure_url);
          } else {
            console.error("Error uploading file:", file.originalname);
          }
        }
      }

      if (files.coverImage) {
        for (const file of files.coverImage) {
          const buffer = await sharp(file.buffer)
            .resize(700)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toBuffer();
          const upload = await uploadToCloudinary(buffer);
          if (upload.secure_url) {
            coverImages.push(upload.secure_url);
          } else {
            console.error("Error uploading file:", file.originalname);
          }
        }
      }

      if (files.image) {
        for (const file of files.image) {
          const buffer = await sharp(file.buffer)
            .resize(700)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toBuffer();
          const upload = await uploadToCloudinary(buffer);
          if (upload.secure_url) {
            imageUrls.push(upload.secure_url);
          } else {
            console.error("Error uploading file:", file.originalname);
          }
        }
      }

      // Ensure req.app.locals.fileUrls is defined
      req.app.locals.fileUrls = req.app.locals.fileUrls || {};
      req.app.locals.fileUrls.mediaUrls = mediaUrls;
      req.app.locals.fileUrls.coverImage = coverImages;
      req.app.locals.fileUrls.image = imageUrls.length > 0 ? imageUrls : null;
    }

    next();
  } catch (error) {
    console.error("Error uploading image:", error);
    next(error);
  }
};

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) {
          console.error("Error uploading buffer:", error);
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(buffer);
  });
};

module.exports = uploadImages;
