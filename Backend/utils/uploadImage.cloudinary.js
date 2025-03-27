const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDNINARY_CLOUD_NAME,
  api_key: process.env.CLOUDNINARY_API_KEY,
  api_secret: process.env.CLOUDNINARY_SECRET_KEY,
});
const uploadImage = async (image) => {
  const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());
  const upload = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "addaCollection" }, (error, uploadResult) => {
        return resolve(uploadResult);
      })
      .end(buffer);
  });
  return upload;
};

module.exports = { uploadImage };
