import express from "express"
import { addAppointment, getPatient } from "../controllers/patientControllers.js";

const router = express.Router();

router.post("/add-appointment",addAppointment);
router.get("/getPatient",getPatient);

export default router