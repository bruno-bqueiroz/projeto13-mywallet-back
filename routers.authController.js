import { createParticipant, loginParticipant } from './authController.js';
import express from 'express';

const router = express.Router();
router.post ('/cadastro', createParticipant);
router.post ('/', loginParticipant);

export default router;