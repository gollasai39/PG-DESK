const express = require('express');
const { body, validationResult } = require('express-validator');
const PG = require('../models/PG');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { generatePGQRCode } = require('../utils/qrCode');

const router = express.Router();

// @route   GET /api/pg
// @desc    Get all PGs with filtering and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      search,
      gender,
      minPrice,
      maxPrice,
      roomType,
      amenities,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { status: 'active', isActive: true };

    // Filter by city
    if (city) {
      query['location.city'] = city;
    }

    // Filter by gender
    if (gender && gender !== 'both') {
      query.gender = { $in: [gender, 'both'] };
    }

    // Search by name or address
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    // Price filter
    if (minPrice || maxPrice) {
      query['rooms.price'] = {};
      if (minPrice) query['rooms.price'].$gte = parseInt(minPrice);
      if (maxPrice) query['rooms.price'].$lte = parseInt(maxPrice);
    }

    // Room type filter
    if (roomType) {
      query['rooms.type'] = roomType;
    }

    // Amenities filter
    if (amenities) {
      const amenityArray = Array.isArray(amenities) ? amenities : [amenities];
      query['amenities.name'] = { $in: amenityArray };
    }

    // Sort options
    const sortOptions = {};
    if (sortBy === 'rating') {
      sortOptions['rating.average'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'price') {
      sortOptions['rooms.price'] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const pgs = await PG.find(query)
      .populate('owner', 'name phone email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await PG.countDocuments(query);

    res.json({
      success: true,
      data: pgs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get PGs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/pg/:id
// @desc    Get single PG by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id)
      .populate('owner', 'name phone email');

    if (!pg || !pg.isActive) {
      return res.status(404).json({
        success: false,
        message: 'PG not found'
      });
    }

    res.json({
      success: true,
      data: pg
    });
  } catch (error) {
    console.error('Get PG error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/pg
// @desc    Create new PG
// @access  Private (Owner only)
router.post('/', protect, authorize('owner'), [
  body('name').trim().notEmpty().withMessage('PG name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.pincode').notEmpty().withMessage('Pincode is required'),
  body('contact.phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid phone number'),
  body('rooms').isArray({ min: 1 }).withMessage('At least one room type is required'),
  body('pricing.securityDeposit').isNumeric().withMessage('Security deposit must be a number')
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

    // Add owner to request body
    req.body.owner = req.user.id;

    const pg = new PG(req.body);
    await pg.save();

    // Generate QR code for the newly created PG
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const qrResult = await generatePGQRCode(pg._id, pg.name, baseUrl);
    
    if (qrResult.success) {
      pg.qrCode = {
        dataUrl: qrResult.qrCodeDataUrl,
        signature: qrResult.signature,
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };
      await pg.save();
    }

    await pg.populate('owner', 'name phone email');

    res.status(201).json({
      success: true,
      message: 'PG created successfully with QR code',
      data: {
        ...pg.toObject(),
        qrCode: qrResult.success ? {
          dataUrl: qrResult.qrCodeDataUrl,
          expiresAt: pg.qrCode.expiresAt
        } : null
      }
    });
  } catch (error) {
    console.error('Create PG error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/pg/:id
// @desc    Update PG
// @access  Private (Owner only)
router.put('/:id', protect, authorize('owner'), [
  body('name').optional().trim().notEmpty().withMessage('PG name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
], async (req, res) => {
  try {
    let pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({
        success: false,
        message: 'PG not found'
      });
    }

    // Check ownership
    if (pg.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this PG'
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    pg = await PG.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name phone email');

    res.json({
      success: true,
      message: 'PG updated successfully',
      data: pg
    });
  } catch (error) {
    console.error('Update PG error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/pg/:id
// @desc    Delete PG
// @access  Private (Owner only)
router.delete('/:id', protect, authorize('owner'), async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({
        success: false,
        message: 'PG not found'
      });
    }

    // Check ownership
    if (pg.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this PG'
      });
    }

    // Soft delete
    pg.isActive = false;
    await pg.save();

    res.json({
      success: true,
      message: 'PG deleted successfully'
    });
  } catch (error) {
    console.error('Delete PG error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/pg/cities
// @desc    Get list of cities with PG count
// @access  Public
router.get('/cities/list', async (req, res) => {
  try {
    const cities = await PG.aggregate([
      { $match: { status: 'active', isActive: true } },
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/pg/:id/review
// @desc    Add review to PG
// @access  Private
router.post('/:id/review', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
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

    const { rating, comment } = req.body;
    const pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({
        success: false,
        message: 'PG not found'
      });
    }

    // Update PG rating
    await pg.updateRating(rating);

    res.json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/pg/:id/qr
// @desc    Get or regenerate QR code for PG
// @access  Private (Owner only)
router.get('/:id/qr', protect, authorize('owner'), async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({
        success: false,
        message: 'PG not found'
      });
    }

    // Check ownership
    if (pg.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this PG QR code'
      });
    }

    // Check if existing QR code is still valid (not expired)
    const now = new Date();
    if (pg.qrCode && pg.qrCode.expiresAt && pg.qrCode.expiresAt > now) {
      return res.json({
        success: true,
        message: 'Existing QR code is still valid',
        data: {
          dataUrl: pg.qrCode.dataUrl,
          expiresAt: pg.qrCode.expiresAt,
          generatedAt: pg.qrCode.generatedAt
        }
      });
    }

    // Generate new QR code
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const qrResult = await generatePGQRCode(pg._id, pg.name, baseUrl);

    if (!qrResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate QR code'
      });
    }

    // Update PG with new QR code
    pg.qrCode = {
      dataUrl: qrResult.qrCodeDataUrl,
      signature: qrResult.signature,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
    await pg.save();

    res.json({
      success: true,
      message: 'QR code generated successfully',
      data: {
        dataUrl: pg.qrCode.dataUrl,
        expiresAt: pg.qrCode.expiresAt,
        generatedAt: pg.qrCode.generatedAt
      }
    });
  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/pg/:id/qr/regenerate
// @desc    Force regenerate QR code for PG
// @access  Private (Owner only)
router.post('/:id/qr/regenerate', protect, authorize('owner'), async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({
        success: false,
        message: 'PG not found'
      });
    }

    // Check ownership
    if (pg.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to regenerate this PG QR code'
      });
    }

    // Generate new QR code
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const qrResult = await generatePGQRCode(pg._id, pg.name, baseUrl);

    if (!qrResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate QR code'
      });
    }

    // Update PG with new QR code
    pg.qrCode = {
      dataUrl: qrResult.qrCodeDataUrl,
      signature: qrResult.signature,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
    await pg.save();

    res.json({
      success: true,
      message: 'QR code regenerated successfully',
      data: {
        dataUrl: pg.qrCode.dataUrl,
        expiresAt: pg.qrCode.expiresAt,
        generatedAt: pg.qrCode.generatedAt
      }
    });
  } catch (error) {
    console.error('Regenerate QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
