import express from 'express';
import { migrateData } from '../controllers/migrationController.js';

const router = express.Router();

router.post('/', migrateData);

export default router;
