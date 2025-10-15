import express from "express";
import { addDoctor, allDoctor, loginAdmin } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, upload.single('doc_img'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctor)
export default adminRouter