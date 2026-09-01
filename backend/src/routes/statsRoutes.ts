import express from 'express';
import { getPublicStats } from '../controllers/statsController';

const router = express.Router();

router.get('/public', getPublicStats);

export default router;
