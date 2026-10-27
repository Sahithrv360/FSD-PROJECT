import mongoose from 'mongoose';
import Reservation from '../models/Reservation.js';
import Restaurant from '../models/Restaurant.js';
import Table from '../models/Table.js';

// Helper to add minutes to HH:mm string
export const calculateEndTime = (startTimeStr, durationMinutes = 90) => {
  const [hours, mins] = startTimeStr.split(':').map(Number);
  const totalMins = hours * 60 + mins + durationMinutes;
  const endHours = Math.floor(totalMins / 60) % 24;
  const endMins = totalMins % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
};

// Check if two time slots overlap: [startA, endA) and [startB, endB)
export const checkTimeOverlap = (startA, endA, startB, endB) => {
  return startA < endB && endA > startB;
};

// @desc    Check availability for a restaurant on date/time
// @route   GET /api/restaurants/:id/availability
export const checkAvailability = async (req, res, next) => {
  try {
    const { date, time, partySize } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reservation date (YYYY-MM-DD)'
      });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const party = Number(partySize) || 2;
    const requestedTime = time || '19:00';
    const requestedEndTime = calculateEndTime(requestedTime, 90);

    // Fetch all active tables capable of holding the party
    const candidateTables = await Table.find({
      restaurantId: restaurant._id,
      isActive: true,
      capacity: { $gte: party }
    }).sort({ capacity: 1, tableNumber: 1 });

    // Fetch active reservations for this restaurant on this date
    const activeReservations = await Reservation.find({
      restaurantId: restaurant._id,
      date,
      status: { $in: ['pending', 'confirmed', 'seated'] }
    });

    // Check which tables are free at requestedTime
    const bookedTableIdsAtTime = new Set();
    activeReservations.forEach((resv) => {
      if (checkTimeOverlap(resv.startTime, resv.endTime, requestedTime, requestedEndTime)) {
        bookedTableIdsAtTime.add(resv.tableId.toString());
      }
    });

    const availableTables = candidateTables.filter(
      (table) => !bookedTableIdsAtTime.has(table._id.toString())
    );

    // Generate smart slot availability across opening hours
    const [openH] = (restaurant.openingHours?.open || '11:00').split(':').map(Number);
    const [closeH] = (restaurant.openingHours?.close || '23:00').split(':').map(Number);
    const slots = [];

    for (let h = openH; h <= closeH - 2; h += 1) {
      for (const m of ['00', '30']) {
        const slotStart = `${String(h).padStart(2, '0')}:${m}`;
        const slotEnd = calculateEndTime(slotStart, 90);
        if (slotEnd <= (restaurant.openingHours?.close || '23:00')) {
          const bookedIds = new Set();
          activeReservations.forEach((resv) => {
            if (checkTimeOverlap(resv.startTime, resv.endTime, slotStart, slotEnd)) {
              bookedIds.add(resv.tableId.toString());
            }
          });
          const freeTablesCount = candidateTables.filter(
            (t) => !bookedIds.has(t._id.toString())
          ).length;

          slots.push({
            time: slotStart,
            endTime: slotEnd,
            isAvailable: freeTablesCount > 0,
            availableTablesCount: freeTablesCount
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
        date,
        requestedTime,
        requestedEndTime,
        partySize: party,
        openingHours: restaurant.openingHours,
        totalSuitableTables: candidateTables.length,
        availableTablesCount: availableTables.length,
        availableTables,
        slots
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a reservation
// @route   POST /api/reservations
export const createReservation = async (req, res, next) => {
  try {
    const {
      restaurantId,
      tableId,
      date,
      startTime,
      partySize,
      specialRequests
    } = req.body;

    // Validate required fields
    if (!restaurantId || !date || !startTime || !partySize) {
      return res.status(400).json({
        success: false,
        message: 'Please provide restaurantId, date (YYYY-MM-DD), startTime (HH:mm), and partySize'
      });
    }

    const party = Number(partySize);
    if (isNaN(party) || party < 1) {
      return res.status(400).json({
        success: false,
        message: 'Party size must be a positive integer of at least 1 person'
      });
    }

    // Validate Date format & past date check
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Date must be formatted as YYYY-MM-DD'
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return res.status(400).json({
        success: false,
        message: 'Cannot make a reservation for a date in the past'
      });
    }

    // Verify restaurant exists and is active
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found or is currently not accepting reservations'
      });
    }

    // Calculate default 90 minutes duration
    const endTime = calculateEndTime(startTime, 90);

    // Check opening hours
    const openTime = restaurant.openingHours?.open || '11:00';
    const closeTime = restaurant.openingHours?.close || '23:00';
    if (startTime < openTime || endTime > closeTime) {
      return res.status(400).json({
        success: false,
        message: `Reservation slot ${startTime}–${endTime} is outside restaurant operating hours (${openTime}–${closeTime})`
      });
    }

    let targetTable;

    if (tableId) {
      // User specified a table
      targetTable = await Table.findOne({
        _id: tableId,
        restaurantId,
        isActive: true
      });

      if (!targetTable) {
        return res.status(404).json({
          success: false,
          message: 'Selected table was not found or is currently inactive'
        });
      }

      if (party > targetTable.capacity) {
        return res.status(400).json({
          success: false,
          message: `Party size (${party}) exceeds maximum capacity of table #${targetTable.tableNumber} (Max ${targetTable.capacity} guests)`
        });
      }

      // Check conflict for this table
      const conflict = await Reservation.findOne({
        tableId: targetTable._id,
        date,
        status: { $in: ['pending', 'confirmed', 'seated'] },
        $or: [
          { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          conflict: true,
          message: `Table #${targetTable.tableNumber} is already booked from ${conflict.startTime} to ${conflict.endTime} on ${date}. Please select another table or time.`
        });
      }
    } else {
      // Auto-allocate table
      const suitableTables = await Table.find({
        restaurantId,
        isActive: true,
        capacity: { $gte: party }
      }).sort({ capacity: 1, tableNumber: 1 });

      if (suitableTables.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No active tables at ${restaurant.name} can accommodate a party of ${party} guests`
        });
      }

      // Find first suitable table without overlap
      for (const table of suitableTables) {
        const conflict = await Reservation.findOne({
          tableId: table._id,
          date,
          status: { $in: ['pending', 'confirmed', 'seated'] },
          $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
          ]
        });

        if (!conflict) {
          targetTable = table;
          break;
        }
      }

      if (!targetTable) {
        return res.status(409).json({
          success: false,
          conflict: true,
          message: `All suitable tables for party size ${party} are booked at ${startTime} on ${date}. Please choose an alternative time slot.`
        });
      }
    }

    // Create reservation
    const reservation = await Reservation.create({
      userId: req.user._id,
      restaurantId,
      tableId: targetTable._id,
      date,
      startTime,
      endTime,
      partySize: party,
      specialRequests: specialRequests || '',
      status: 'confirmed'
    });

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('restaurantId', 'name address phone cuisine')
      .populate('tableId', 'tableNumber capacity area')
      .populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Reservation confirmed successfully!',
      data: populatedReservation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's reservations
// @route   GET /api/reservations/my
export const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id })
      .populate('restaurantId', 'name address phone cuisine images')
      .populate('tableId', 'tableNumber capacity area')
      .sort({ date: -1, startTime: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single reservation by ID
// @route   GET /api/reservations/:id
export const getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('restaurantId', 'name address phone cuisine managerId')
      .populate('tableId', 'tableNumber capacity area')
      .populate('userId', 'name email');

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // Check authorization: customer owner, restaurant manager, or admin
    const isOwner = reservation.userId._id.toString() === req.user._id.toString();
    const isManager = reservation.restaurantId?.managerId?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isManager && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this reservation'
      });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel reservation
// @route   PATCH /api/reservations/:id/cancel
export const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('restaurantId', 'managerId name');

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    const isOwner = reservation.userId.toString() === req.user._id.toString();
    const isManager = reservation.restaurantId?.managerId?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isManager && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this reservation'
      });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Reservation is already cancelled'
      });
    }

    if (reservation.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an already completed dining reservation'
      });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};
