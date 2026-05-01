const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const PG = require('../models/PG');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/booking
// @desc    Create new booking
// @access  Private (User only)
router.post('/', protect, authorize('user'), [
  body('pgId').isMongoId().withMessage('Invalid PG ID'),
  body('roomType').isIn(['single', 'double', 'triple', 'four']).withMessage('Invalid room type'),
  body('checkInDate').isISO8601().withMessage('Invalid check-in date'),
  body('checkOutDate').isISO8601().withMessage('Invalid check-out date'),
  body('requirements').optional().trim().isLength({ max: 500 }).withMessage('Requirements cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { pgId, roomType, checkInDate, checkOutDate, requirements } = req.body;

    // Check if PG exists and is active
    const pg = await PG.findById(pgId);
    if (!pg || !pg.isActive) {
      return res.status(404).json({
        success: false,
        message: 'PG not found'
      });
    }

    // Find the specific room type
    const room = pg.rooms.find(r => r.type === roomType);
    if (!room) {
      return res.status(400).json({
        success: false,
        message: 'Room type not available'
      });
    }

    // Check if rooms are available
    if (room.availableRooms <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No rooms available for this type'
      });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();

    if (checkIn <= today) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date must be in the future'
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Calculate duration and amounts
    const diffTime = Math.abs(checkOut - checkIn);
    const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    const monthlyRent = room.price;
    const totalAmount = monthlyRent * duration;
    const securityDeposit = pg.pricing.securityDeposit;
    const advanceAmount = monthlyRent * pg.pricing.advancePayment;

    // Check for existing bookings for the same period
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      pg: pgId,
      status: { $in: ['pending', 'confirmed', 'active'] },
      $or: [
        {
          checkInDate: { $lte: checkIn },
          checkOutDate: { $gte: checkIn }
        },
        {
          checkInDate: { $lte: checkOut },
          checkOutDate: { $gte: checkOut }
        },
        {
          checkInDate: { $gte: checkIn },
          checkOutDate: { $lte: checkOut }
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking for this PG in the selected period'
      });
    }

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      pg: pgId,
      roomType,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      duration,
      monthlyRent,
      totalAmount,
      securityDeposit,
      advanceAmount,
      requirements,
      payments: [
        {
          type: 'advance',
          amount: advanceAmount,
          dueDate: new Date(),
          status: 'pending'
        },
        {
          type: 'security',
          amount: securityDeposit,
          dueDate: new Date(),
          status: 'pending'
        }
      ]
    });

    await booking.save();

    // Update available rooms
    await pg.updateAvailableRooms(roomType, -1);

    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'pg', select: 'name location contact images' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/booking
// @desc    Get user's bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('pg', 'name location images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/booking/:id
// @desc    Get single booking by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('pg', 'name location contact images rooms amenities rules');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership or PG ownership
    const isOwner = booking.user._id.toString() === req.user.id;
    let isPGOwner = false;

    if (!isOwner && req.user.role === 'owner') {
      const pg = await PG.findById(booking.pg._id);
      isPGOwner = pg && pg.owner.toString() === req.user.id;
    }

    if (!isOwner && !isPGOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/booking/:id/status
// @desc    Update booking status
// @access  Private (Owner for confirmation, User for cancellation)
router.put('/:id/status', protect, [
  body('status').isIn(['confirmed', 'cancelled', 'active', 'completed']).withMessage('Invalid status'),
  body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, reason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('pg');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permissions
    const isUser = booking.user.toString() === req.user.id;
    const isPGOwner = booking.pg.owner.toString() === req.user.id;

    // Users can only cancel their own bookings
    if (status === 'cancelled' && !isUser) {
      return res.status(403).json({
        success: false,
        message: 'Only the user can cancel the booking'
      });
    }

    // PG owners can only confirm bookings
    if (status === 'confirmed' && !isPGOwner) {
      return res.status(403).json({
        success: false,
        message: 'Only the PG owner can confirm the booking'
      });
    }

    // Validate status transitions
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify a cancelled or completed booking'
      });
    }

    // Update booking
    booking.status = status;

    if (status === 'cancelled') {
      booking.cancellation = {
        reason: reason || 'User cancelled',
        cancelledBy: req.user.id,
        cancelledAt: new Date()
      };

      // Restore available room
      await booking.pg.updateAvailableRooms(booking.roomType, 1);
    }

    if (status === 'confirmed') {
      booking.status = 'active';
    }

    await booking.save();

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/booking/:id/payment
// @desc    Add payment to booking
// @access  Private
router.post('/:id/payment', protect, [
  body('paymentType').isIn(['advance', 'security', 'monthly']).withMessage('Invalid payment type'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('paymentId').notEmpty().withMessage('Payment ID is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { paymentType, amount, paymentId, paymentMethod } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to make payment for this booking'
      });
    }

    // Add payment
    await booking.addPayment(paymentType, amount, paymentId, paymentMethod);

    res.json({
      success: true,
      message: 'Payment added successfully',
      data: booking
    });
  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
