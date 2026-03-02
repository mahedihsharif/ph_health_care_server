import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "node:path";
import config from "../config";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const uploadToCloudinary = async (file: Express.Multer.File) => {
  // Configuration
  cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET,
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(file.path, {
      folder: "ph-health-care",
      public_id: file.filename,
    })
    .catch((error) => {
      console.log(error);
    });

  return uploadResult;
};

const upload = multer({ storage: storage });

export const fileUploader = { upload, uploadToCloudinary };
