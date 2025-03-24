import express from "express";
import multer from "multer";
import {
  submitPropertyRequest,
  approvePropertyRequest,
  getAllProperties,
  getPropertyById,
  requestPropertyUpdate,
  requestPropertyDelete,
  getPendingRequests,
  rejectPropertyRequest
} from "../Controller/propertyController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post("/add", upload.single("image"), submitPropertyRequest);
router.post("/update", upload.single("image"), requestPropertyUpdate);
router.delete("/reject/:id", rejectPropertyRequest);
router.get("/pending", getPendingRequests);
router.delete("/delete/:id", requestPropertyDelete);
router.post("/approve/:id", approvePropertyRequest);
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

export default router;