import express from "express"
import { addAppointment } from "../controllers/patientControllers.js";

const router = express.Router();

router.post("/patient/add-appointment",addAppointment);

export default router