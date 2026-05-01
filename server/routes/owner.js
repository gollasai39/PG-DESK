const express = require('express');
const { body, validationResult } = require('express-validator');
const PG = require('../models/PG');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/owner/dashboard
// @desc    Get owner dashboard data
// @access  Private (Owner only)
router.get('/dashboard', protect, authorize('owner'), async (req, res) => {
  try {
    // Get owner's PGs
    const pgs = await PG.find({ owner: req.user.id, isActive: true });
    
    // Get all bookings for owner's PGs
    const pgIds = pgs.map(pg => pg._id);
    const bookings = await Booking.find({ pg: { $in: pgIds } })
      .populate('user', 'name email phone')
      .populate('pg', 'name location')
      .sort({ createdAt: -1 });

    // Calculate dashboard stats
    const totalProperties = pgs.length;
    const totalRooms = pgs.reduce((sum, pg) => 
      sum + pg.rooms.reduce((roomSum, room) => roomSum + room.totalRooms, 0), 0);
    const occupiedRooms = pgs.reduce((sum, pg) => 
      sum + pg.rooms.reduce((roomSum, room) => roomSum + (room.totalRooms - room.availableRooms), 0), 0);
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    
    const monthlyRevenue = bookings
      .filter(b => b.status === 'active' || b.status === 'confirmed')
      .reduce((sum, b) => sum + b.monthlyRent, 0);

    const activeBookings = bookings.filter(b => b.status === 'active');
    const pendingBookings = bookings.filter(b => b.status === 'pending');

    // Get recent bookings
    const recentBookings = bookings.slice(0, 5);

    // Get monthly revenue trend (last 6 months)
    const revenueTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthRevenue = bookings
        .filter(b => {
          const bookingDate = new Date(b.createdAt);
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        })
        .reduce((sum, b) => sum + b.monthlyRent, 0);
      
      revenueTrend.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue
      });
    }

    res.json({
      success: true,
      data: {
        stats: {
          totalProperties,
          totalRooms,
          occupiedRooms,
          occupancyRate,
          monthlyRevenue,
          activeBookings: activeBookings.length,
          pendingBookings: pendingBookings.length
        },
        recentBookings,
        revenueTrend,
        properties: pgs.map(pg => ({
          id: pg._id,
          name: pg.name,
          location: pg.location,
          totalRooms: pg.rooms.reduce((sum, room) => sum + room.totalRooms, 0),
          occupiedRooms: pg.rooms.reduce((sum, room) => sum + (room.totalRooms - room.availableRooms), 0),
          monthlyRevenue: pg.rooms.reduce((sum, room) => sum + (room.price * (room.totalRooms - room.availableRooms)), 0),
          rating: pg.rating.average
        }))
      }
    });
  } catch (error) {
    console.error('Owner dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/owner/properties
// @desc    Get owner's properties
// @access  Private (Owner only)
router.get('/properties', protect, authorize('owner'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    const query = { owner: req.user.id };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const properties = await PG.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PG.countDocuments(query);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/owner/bookings
// @desc    Get bookings for owner's properties
// @access  Private (Owner only)
router.get('/bookings', protect, authorize('owner'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, pgId } = req.query;

    // Get owner's PGs
    const pgs = await PG.find({ owner: req.user.id });
    const pgIds = pgs.map(pg => pg._id);

    // Build query
    const query = { pg: { $in: pgIds } };
    if (status) {
      query.status = status;
    }
    if (pgId) {
      query.pg = pgId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('pg', 'name location')
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

// @route   GET /api/owner/tenants
// @desc    Get tenants for owner's properties
// @access  Private (Owner only)
router.get('/tenants', protect, authorize('owner'), async (req, res) => {
  try {
    const { page = 1, limit = 10, pgId } = req.query;

    // Get owner's PGs
    const pgs = await PG.find({ owner: req.user.id });
    const pgIds = pgs.map(pg => pg._id);

    // Build query for active bookings
    const query = { 
      pg: { $in: pgIds },
      status: 'active'
    };
    if (pgId) {
      query.pg = pgId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('pg', 'name location')
      .sort({ checkInDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    // Transform bookings to tenant format
    const tenants = bookings.map(booking => ({
      bookingId: booking._id,
      tenant: booking.user,
      pg: booking.pg,
      roomType: booking.roomType,
      monthlyRent: booking.monthlyRent,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      paymentStatus: booking.paymentStatus,
      nextPaymentDue: booking.getNextPaymentDue()
    }));

    res.json({
      success: true,
      data: tenants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/owner/revenue
// @desc    Get revenue analytics
// @access  Private (Owner only)
router.get('/revenue', protect, authorize('owner'), async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;

    // Get owner's PGs
    const pgs = await PG.find({ owner: req.user.id });
    const pgIds = pgs.map(pg => pg._id);

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    // Get bookings
    const matchStage = {
      pg: { $in: pgIds },
      paymentStatus: 'paid'
    };
    if (Object.keys(dateFilter).length > 0) {
      matchStage.createdAt = dateFilter;
    }

    // Aggregate revenue
    const revenueData = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: groupBy === 'day' ? { $dayOfMonth: '$createdAt' } : null
          },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Format response
    const formattedData = revenueData.map(item => ({
      period: groupBy === 'day' 
        ? `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`
        : `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      revenue: item.revenue,
      bookings: item.bookings
    }));

    // Get overall stats
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalBookings = revenueData.reduce((sum, item) => sum + item.bookings, 0);

    res.json({
      success: true,
      data: {
        revenueData: formattedData,
        stats: {
          totalRevenue,
          totalBookings,
          averageRevenuePerBooking: totalBookings > 0 ? totalRevenue / totalBookings : 0
        }
      }
    });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/owner/property/:id/status
// @desc    Update property status
// @access  Private (Owner only)
router.put('/property/:id/status', protect, authorize('owner'), [
  body('status').isIn(['active', 'inactive']).withMessage('Invalid status')
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

    const { status } = req.body;
    const property = await PG.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    property.status = status;
    await property.save();

    res.json({
      success: true,
      message: `Property ${status} successfully`,
      data: property
    });
  } catch (error) {
    console.error('Update property status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
