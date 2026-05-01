const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'PG name is required'],
    trim: true,
    maxlength: [100, 'PG name cannot exceed 100 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      enum: ['Bangalore', 'Hyderabad', 'Chennai', 'Mumbai', 'Pune', 'Delhi', 'Kolkata', 'Jaipur']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Contact phone is required']
    },
    email: String,
    alternatePhone: String
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String,
    caption: String
  }],
  amenities: [{
    name: {
      type: String,
      required: true
    },
    icon: String,
    included: {
      type: Boolean,
      default: true
    }
  }],
  rooms: [{
    type: {
      type: String,
      enum: ['single', 'double', 'triple', 'four'],
      required: true
    },
    totalRooms: {
      type: Number,
      required: true,
      min: [1, 'At least 1 room is required']
    },
    availableRooms: {
      type: Number,
      required: true,
      min: [0, 'Available rooms cannot be negative']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    size: String, // e.g., "120 sq.ft"
    features: [String], // e.g., ["Attached Bathroom", "Balcony", "AC"]
    images: [String]
  }],
  gender: {
    type: String,
    enum: ['male', 'female', 'both'],
    default: 'both'
  },
  rules: [{
    title: String,
    description: String
  }],
  pricing: {
    securityDeposit: {
      type: Number,
      required: true,
      min: [0, 'Security deposit cannot be negative']
    },
    noticePeriod: {
      type: Number,
      default: 30, // days
      min: [0, 'Notice period cannot be negative']
    },
    advancePayment: {
      type: Number,
      default: 1, // months
      min: [0, 'Advance payment cannot be negative']
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative']
    }
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  qrCode: {
    dataUrl: String,
    signature: String,
    generatedAt: Date,
    expiresAt: Date
  }
}, {
  timestamps: true
});

// Index for search functionality
pgSchema.index({ 'location.city': 1, 'location.address': 'text', name: 'text' });
pgSchema.index({ owner: 1 });
pgSchema.index({ status: 1 });
pgSchema.index({ 'rating.average': -1 });

// Update available rooms method
pgSchema.methods.updateAvailableRooms = async function(roomType, change) {
  const room = this.rooms.find(r => r.type === roomType);
  if (room) {
    room.availableRooms = Math.max(0, room.availableRooms + change);
    await this.save();
  }
};

// Calculate occupancy rate
pgSchema.methods.getOccupancyRate = function() {
  const totalRooms = this.rooms.reduce((sum, room) => sum + room.totalRooms, 0);
  const occupiedRooms = this.rooms.reduce((sum, room) => sum + (room.totalRooms - room.availableRooms), 0);
  return totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
};

// Update rating method
pgSchema.methods.updateRating = async function(newRating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  await this.save();
};

module.exports = mongoose.model('PG', pgSchema);
