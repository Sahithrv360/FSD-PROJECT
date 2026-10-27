import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant reference is required']
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: [true, 'Table reference is required']
    },
    date: {
      type: String, // YYYY-MM-DD
      required: [true, 'Reservation date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD']
    },
    startTime: {
      type: String, // HH:mm
      required: [true, 'Start time is required'],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be in HH:mm 24-hour format']
    },
    endTime: {
      type: String, // HH:mm
      required: [true, 'End time is required'],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be in HH:mm 24-hour format']
    },
    partySize: {
      type: Number,
      required: [true, 'Party size is required'],
      min: [1, 'Party size must be at least 1 person']
    },
    specialRequests: {
      type: String,
      default: '',
      maxlength: [300, 'Special requests cannot exceed 300 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'rejected'],
      default: 'confirmed'
    }
  },
  {
    timestamps: true
  }
);

// Performance & availability query indexing
reservationSchema.index({ tableId: 1, date: 1, status: 1 });
reservationSchema.index({ restaurantId: 1, date: 1, status: 1 });
reservationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Reservation', reservationSchema);
