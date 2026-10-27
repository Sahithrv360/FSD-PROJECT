import express from 'express';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant
} from '../controllers/restaurantController.js';
import { getRestaurantTables, addTable } from '../controllers/tableController.js';
import { checkAvailability } from '../controllers/reservationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getRestaurants)
  .post(protect, authorize('manager', 'admin'), createRestaurant);

router.route('/:id')
  .get(getRestaurantById)
  .put(protect, authorize('manager', 'admin'), updateRestaurant);

// Restaurant tables
router.route('/:id/tables')
  .get(getRestaurantTables)
  .post(protect, authorize('manager', 'admin'), addTable);

// Table availability check
router.route('/:id/availability')
  .get(checkAvailability);

export default router;
