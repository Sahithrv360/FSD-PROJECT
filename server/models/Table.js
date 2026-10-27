import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant reference is required']
    },
    tableNumber: {
      type: String,
      required: [true, 'Table number is required'],
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Seating capacity is required'],
      min: [1, 'Capacity must be at least 1 person']
    },
    area: {
      type: String,
      enum: ['Main Dining Room', 'Window View', 'Terrace & Patio', 'Private Dining / Lounge', 'Bar Counter'],
      default: 'Main Dining Room'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate table numbers in the same restaurant
tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });
tableSchema.index({ restaurantId: 1, capacity: 1, isActive: 1 });

export default mongoose.model('Table', tableSchema);
