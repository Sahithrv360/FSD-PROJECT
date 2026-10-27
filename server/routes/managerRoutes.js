import express from 'express';
import {
  getManagerReservations,
  updateReservationStatus,
  getManagerDashboard,
  getManagerReports
} from '../controllers/managerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('manager', 'admin'));

router.get('/dashboard', getManagerDashboard);
router.get('/reports', getManagerReports);
router.get('/reservations', getManagerReservations);
router.patch('/reservations/:id/status', updateReservationStatus);

export default router;
