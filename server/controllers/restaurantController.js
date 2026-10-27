import Restaurant from '../models/Restaurant.js';
import Table from '../models/Table.js';

// @desc    Get all restaurants with filtering & search
// @route   GET /api/restaurants
export const getRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, priceLevel } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } }
      ];
    }

    if (cuisine && cuisine !== 'All') {
      query.cuisine = { $regex: new RegExp(`^${cuisine}$`, 'i') };
    }

    if (priceLevel && priceLevel !== 'All') {
      query.priceLevel = priceLevel;
    }

    const restaurants = await Restaurant.find(query).sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant by ID with tables
// @route   GET /api/restaurants/:id
export const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('managerId', 'name email');

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const tables = await Table.find({ restaurantId: restaurant._id, isActive: true }).sort({ capacity: 1, tableNumber: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...restaurant.toObject(),
        tables
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new restaurant
// @route   POST /api/restaurants
export const createRestaurant = async (req, res, next) => {
  try {
    const { name, description, cuisine, priceLevel, address, phone, images, openingHours, features } = req.body;

    if (!name || !description || !cuisine || !address?.street || !address?.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide restaurant name, description, cuisine, and complete address (street and city)'
      });
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      cuisine,
      priceLevel: priceLevel || '$$$',
      address,
      phone: phone || '',
      images: images || [],
      openingHours: openingHours || { open: '11:00', close: '23:00' },
      features: features || [],
      managerId: req.user._id
    });

    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
export const updateRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Ensure user is manager of this restaurant or admin
    if (req.user.role !== 'admin' && restaurant.managerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this restaurant'
      });
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};
