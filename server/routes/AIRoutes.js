import express from "express"
import { generateEnglish, generateHindi, getFollowUpEnglish, getFollowUpHindi } from "../controllers/AIControllers.js";

const router = express.Router();

router.post("/ask-hi",getFollowUpHindi);
router.post("/ask-en",getFollowUpEnglish);
router.post("/gen-hi",generateHindi);
router.post("/gen-en",generateEnglish);

export default router