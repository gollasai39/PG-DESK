const express = require('express');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/user/dashboard
// @desc    Get user dashboard data
// @access  Private (User only)
router.get('/dashboard', protect, authorize('user'), async (req, res) => {
  try {
    // Get user's bookings
    const bookings = await Booking.find({ user: req.user.id })
      .populate('pg', 'name location images')
      .sort({ createdAt: -1 });

    // Calculate dashboard stats
    const activeBookings = bookings.filter(b => b.status === 'active');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const totalSpent = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    // Get upcoming payments
    const upcomingPayments = [];
    bookings.forEach(booking => {
      if (booking.status === 'active' || booking.status === 'confirmed') {
        const nextPayment = booking.getNextPaymentDue();
        if (nextPayment) {
          upcomingPayments.push({
            bookingId: booking._id,
            pgName: booking.pg.name,
            amount: nextPayment.amount,
            dueDate: nextPayment.dueDate,
            type: nextPayment.type
          });
        }
      }
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalBookings: bookings.length,
          activeBookings: activeBookings.length,
          pendingBookings: pendingBookings.length,
          totalSpent
        },
        recentBookings: bookings.slice(0, 5),
        upcomingPayments: upcomingPayments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/user/payments
// @desc    Get user's payment history
// @access  Private (User only)
router.get('/payments', protect, authorize('user'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    const query = { user: req.user.id };
    if (status) {
      query['payments.status'] = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get bookings with payments
    const bookings = await Booking.find(query)
      .populate('pg', 'name location')
      .sort({ createdAt: -1 });

    // Flatten payments from all bookings
    let payments = [];
    bookings.forEach(booking => {
      booking.payments.forEach(payment => {
        payments.push({
          ...payment.toObject(),
          bookingId: booking._id,
          pgName: booking.pg.name,
          pgLocation: booking.pg.location,
          bookingStatus: booking.status
        });
      });
    });

    // Filter by status if provided
    if (status) {
      payments = payments.filter(p => p.status === status);
    }

    // Sort by date
    payments.sort((a, b) => new Date(b.paidAt || b.dueDate) - new Date(a.paidAt || a.dueDate));

    // Paginate
    const total = payments.length;
    const paginatedPayments = payments.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: paginatedPayments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/user/favorites
// @desc    Get user's favorite PGs
// @access  Private (User only)
router.get('/favorites', protect, authorize('user'), async (req, res) => {
  try {
    // This would typically use a separate favorites model
    // For now, returning empty array as placeholder
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/user/favorites
// @desc    Add PG to favorites
// @access  Private (User only)
router.post('/favorites', protect, authorize('user'), async (req, res) => {
  try {
    const { pgId } = req.body;
    
    // This would typically add to a favorites model
    // For now, returning success as placeholder
    
    res.json({
      success: true,
      message: 'PG added to favorites'
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/user/favorites/:pgId
// @desc    Remove PG from favorites
// @access  Private (User only)
router.delete('/favorites/:pgId', protect, authorize('user'), async (req, res) => {
  try {
    // This would typically remove from favorites model
    // For now, returning success as placeholder
    
    res.json({
      success: true,
      message: 'PG removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
