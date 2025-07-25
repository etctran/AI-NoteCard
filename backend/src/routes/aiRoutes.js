import express from 'express';
import { checkGrammar, analyzeTone, generateCompletions } from '../controllers/aiController.js';

const router = express.Router();

// Grammar checking endpoint
router.post('/grammar-check', checkGrammar);

// Tone analysis endpoint  
router.post('/tone-analysis', analyzeTone);

// Text completion endpoint
router.post('/completions', generateCompletions);

export default router;
