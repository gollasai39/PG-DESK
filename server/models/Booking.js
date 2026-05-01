const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PG',
    required: true
  },
  roomType: {
    type: String,
    enum: ['single', 'double', 'triple', 'four'],
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in months
    required: true
  },
  monthlyRent: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    required: true
  },
  advanceAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  payments: [{
    type: {
      type: String,
      enum: ['advance', 'security', 'monthly', 'refund'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    paymentId: String,
    paymentMethod: String,
    paidAt: Date,
    dueDate: Date
  }],
  requirements: {
    type: String,
    maxlength: [500, 'Requirements cannot exceed 500 characters']
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  cancellation: {
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending'
    }
  },
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    reviewedAt: Date
  },
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ pg: 1, status: 1 });
bookingSchema.index({ checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ 'payments.dueDate': 1, 'payments.status': 1 });

// Pre-save middleware to calculate duration and total amount
bookingSchema.pre('save', function(next) {
  if (this.checkInDate && this.checkOutDate) {
    const diffTime = Math.abs(this.checkOutDate - this.checkInDate);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    this.duration = diffMonths;
    this.totalAmount = this.monthlyRent * diffMonths;
  }
  next();
});

// Method to add payment
bookingSchema.methods.addPayment = function(paymentType, amount, paymentId, paymentMethod) {
  this.payments.push({
    type: paymentType,
    amount: amount,
    paymentId: paymentId,
    paymentMethod: paymentMethod,
    status: 'completed',
    paidAt: new Date()
  });
  
  // Update payment status
  const totalPaid = this.payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  if (totalPaid >= this.totalAmount + this.securityDeposit) {
    this.paymentStatus = 'paid';
  } else if (totalPaid > 0) {
    this.paymentStatus = 'partial';
  }
  
  return this.save();
};

// Method to check if payment is due
bookingSchema.methods.isPaymentDue = function() {
  const pendingPayments = this.payments.filter(p => 
    p.status === 'pending' && 
    new Date(p.dueDate) <= new Date()
  );
  return pendingPayments.length > 0;
};

// Method to get next payment due
bookingSchema.methods.getNextPaymentDue = function() {
  const pendingPayments = this.payments.filter(p => p.status === 'pending');
  if (pendingPayments.length === 0) return null;
  
  return pendingPayments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
};

// Static method to find active bookings
bookingSchema.statics.findActiveBookings = function(userId) {
  return this.find({
    user: userId,
    status: { $in: ['confirmed', 'active'] }
  }).populate('pg', 'name location images');
};

// Static method to find overdue payments
bookingSchema.statics.findOverduePayments = function() {
  return this.find({
    'payments.dueDate': { $lte: new Date() },
    'payments.status': 'pending',
    status: { $in: ['confirmed', 'active'] }
  }).populate('user pg');
};

module.exports = mongoose.model('Booking', bookingSchema);
