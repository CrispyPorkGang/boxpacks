import multer from "multer";
import path from "path";
import fs from "fs-extra";
import { randomUUID } from "crypto";

// Ensure upload directories exist
fs.ensureDirSync(path.join(process.cwd(), "uploads"));
fs.ensureDirSync(path.join(process.cwd(), "uploads/images"));
fs.ensureDirSync(path.join(process.cwd(), "uploads/videos"));

// Configure image storage
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads/images"));
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to prevent conflicts
    const uniqueFileName = `${Date.now()}-${randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  }
});

// Configure video storage
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads/videos"));
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to prevent conflicts
    const uniqueFileName = `${Date.now()}-${randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  }
});

// File filter for images
const imageFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only image files are allowed!"));
};

// File filter for videos
const videoFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const filetypes = /mp4|webm|avi|mov|mpeg|mkv/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only video files are allowed!"));
};

// Setup Multer for image uploads with a maximum file size of 5MB
export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter
});

// Setup Multer for video uploads with a maximum file size of 50MB
export const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: videoFileFilter
});

// Helper to delete a file
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    if (!filePath.startsWith("/uploads/")) return false;
    
    const fullPath = path.join(process.cwd(), filePath);
    await fs.remove(fullPath);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};