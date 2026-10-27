import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a restaurant name'],
      trim: true,
      maxlength: [100, 'Restaurant name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a restaurant description'],
      trim: true
    },
    cuisine: {
      type: String,
      required: [true, 'Please specify cuisine type'],
      trim: true
    },
    priceLevel: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$'],
      default: '$$$'
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' }
    },
    phone: {
      type: String,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },
    openingHours: {
      open: { type: String, default: '11:00' }, // HH:mm format
      close: { type: String, default: '23:00' }
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    features: {
      type: [String],
      default: []
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

restaurantSchema.index({ cuisine: 1, isActive: 1 });
restaurantSchema.index({ managerId: 1 });

export default mongoose.model('Restaurant', restaurantSchema);
