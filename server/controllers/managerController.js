import mongoose from 'mongoose';
import Reservation from '../models/Reservation.js';
import Restaurant from '../models/Restaurant.js';
import Table from '../models/Table.js';

// Helper to get restaurant IDs managed by current user
const getManagedRestaurantIds = async (user) => {
  if (user.role === 'admin') {
    const all = await Restaurant.find({}, '_id');
    return all.map((r) => r._id);
  }
  const managed = await Restaurant.find({ managerId: user._id }, '_id');
  return managed.map((r) => r._id);
};

// @desc    Get all reservations for manager's restaurants
// @route   GET /api/manager/reservations
export const getManagerReservations = async (req, res, next) => {
  try {
    const managedIds = await getManagedRestaurantIds(req.user);

    if (managedIds.length === 0) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const { date, status, restaurantId } = req.query;
    let query = { restaurantId: { $in: managedIds } };

    if (restaurantId && managedIds.map((id) => id.toString()).includes(restaurantId)) {
      query.restaurantId = restaurantId;
    }

    if (date) {
      query.date = date;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const reservations = await Reservation.find(query)
      .populate('restaurantId', 'name address')
      .populate('tableId', 'tableNumber capacity area')
      .populate('userId', 'name email')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reservation status (confirm, reject, seated, completed, cancelled)
// @route   PATCH /api/manager/reservations/:id/status
export const updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const reservation = await Reservation.findById(req.params.id).populate('restaurantId');
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // Verify manager ownership
    const isManager = reservation.restaurantId?.managerId?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isManager && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this restaurant reservation'
      });
    }

    reservation.status = status;
    await reservation.save();

    const updated = await Reservation.findById(reservation._id)
      .populate('restaurantId', 'name address')
      .populate('tableId', 'tableNumber capacity area')
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      message: `Reservation status updated to '${status}'`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get manager dashboard summary
// @route   GET /api/manager/dashboard
export const getManagerDashboard = async (req, res, next) => {
  try {
    const managedIds = await getManagedRestaurantIds(req.user);

    if (managedIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          managedRestaurants: [],
          todayReservationsCount: 0,
          pendingCount: 0,
          upcomingReservations: [],
          totalTables: 0
        }
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const [
      managedRestaurants,
      todayReservationsCount,
      pendingCount,
      upcomingReservations,
      totalTables
    ] = await Promise.all([
      Restaurant.find({ _id: { $in: managedIds } }),
      Reservation.countDocuments({
        restaurantId: { $in: managedIds },
        date: todayStr,
        status: { $in: ['confirmed', 'seated', 'pending'] }
      }),
      Reservation.countDocuments({
        restaurantId: { $in: managedIds },
        status: 'pending'
      }),
      Reservation.find({
        restaurantId: { $in: managedIds },
        date: { $gte: todayStr },
        status: { $in: ['confirmed', 'seated', 'pending'] }
      })
        .populate('restaurantId', 'name')
        .populate('tableId', 'tableNumber capacity area')
        .populate('userId', 'name email')
        .sort({ date: 1, startTime: 1 })
        .limit(10),
      Table.countDocuments({ restaurantId: { $in: managedIds }, isActive: true })
    ]);

    res.status(200).json({
      success: true,
      data: {
        managedRestaurants,
        todayReservationsCount,
        pendingCount,
        totalTables,
        upcomingReservations
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregation reports for manager
// @route   GET /api/manager/reports
export const getManagerReports = async (req, res, next) => {
  try {
    const managedIds = await getManagedRestaurantIds(req.user);

    if (managedIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: { statusSummary: [], dailySummary: [], restaurantSummary: [] }
      });
    }

    // 1. Aggregation pipeline: Status breakdown
    const statusSummary = await Reservation.aggregate([
      { $match: { restaurantId: { $in: managedIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalGuests: { $sum: '$partySize' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 2. Aggregation pipeline: Daily reservation totals
    const dailySummary = await Reservation.aggregate([
      { $match: { restaurantId: { $in: managedIds } } },
      {
        $group: {
          _id: '$date',
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: {
              $cond: [{ $in: ['$status', ['confirmed', 'seated', 'completed']] }, 1, 0]
            }
          },
          cancelledBookings: {
            $sum: {
              $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0]
            }
          },
          totalGuests: { $sum: '$partySize' }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 14 }
    ]);

    // 3. Aggregation pipeline: Restaurant-wise booking statistics
    const restaurantSummary = await Reservation.aggregate([
      { $match: { restaurantId: { $in: managedIds } } },
      {
        $group: {
          _id: '$restaurantId',
          totalBookings: { $sum: 1 },
          totalGuests: { $sum: '$partySize' },
          avgPartySize: { $avg: '$partySize' }
        }
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: '_id',
          foreignField: '_id',
          as: 'restaurantDetails'
        }
      },
      { $unwind: '$restaurantDetails' },
      {
        $project: {
          restaurantName: '$restaurantDetails.name',
          cuisine: '$restaurantDetails.cuisine',
          totalBookings: 1,
          totalGuests: 1,
          avgPartySize: { $round: ['$avgPartySize', 1] }
        }
      },
      { $sort: { totalBookings: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusSummary,
        dailySummary,
        restaurantSummary
      }
    });
  } catch (error) {
    next(error);
  }
};
