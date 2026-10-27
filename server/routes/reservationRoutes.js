import express from 'express';
import {
  createReservation,
  getMyReservations,
  getReservationById,
  cancelReservation
} from '../controllers/reservationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createReservation);
router.get('/my', getMyReservations);
router.get('/:id', getReservationById);
router.patch('/:id/cancel', cancelReservation);

export default router;
