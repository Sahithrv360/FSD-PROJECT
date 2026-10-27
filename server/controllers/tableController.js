import Table from '../models/Table.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Get all active tables for a restaurant
// @route   GET /api/restaurants/:id/tables
export const getRestaurantTables = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const tables = await Table.find({ restaurantId: req.params.id }).sort({ capacity: 1, tableNumber: 1 });

    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add table to restaurant
// @route   POST /api/restaurants/:id/tables
export const addTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity, area, isActive } = req.body;

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Check manager authorization
    if (req.user.role !== 'admin' && restaurant.managerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage tables for this restaurant'
      });
    }

    if (!tableNumber || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Table number and seating capacity are required'
      });
    }

    // Check duplicate tableNumber within same restaurant
    const existingTable = await Table.findOne({
      restaurantId: req.params.id,
      tableNumber: tableNumber.toString().trim()
    });

    if (existingTable) {
      return res.status(400).json({
        success: false,
        message: `Table number '${tableNumber}' already exists in this restaurant`
      });
    }

    const table = await Table.create({
      restaurantId: req.params.id,
      tableNumber: tableNumber.toString().trim(),
      capacity: Number(capacity),
      area: area || 'Main Dining Room',
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      data: table
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a table
// @route   PUT /api/tables/:id
export const updateTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    const restaurant = await Restaurant.findById(table.restaurantId);
    if (req.user.role !== 'admin' && restaurant?.managerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this table'
      });
    }

    const updatedTable = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: updatedTable
    });
  } catch (error) {
    next(error);
  }
};
