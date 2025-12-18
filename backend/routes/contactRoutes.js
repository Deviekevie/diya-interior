import express from "express";
import { submitContact, getAllContacts } from '../controllers/contactController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route - submit contact form
router.post('/', submitContact);

// Protected route - get all contacts (admin only)
router.get('/', verifyAdmin, getAllContacts);

export default router;
