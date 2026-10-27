import express from 'express';
import { updateTable } from '../controllers/tableController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/:id')
  .put(protect, authorize('manager', 'admin'), updateTable);

export default router;
