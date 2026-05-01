const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PG = require('../models/PG');

require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await PG.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const testUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        isEmailVerified: true,
        isActive: true
      },
      {
        name: 'PG Owner',
        email: 'owner@example.com',
        phone: '9876543211',
        password: await bcrypt.hash('password123', 10),
        role: 'owner',
        isEmailVerified: true,
        isActive: true
      }
    ];

    const createdUsers = await User.insertMany(testUsers);
    console.log('Created test users:', createdUsers.length);

    // Create test PGs
    const ownerUser = createdUsers.find(u => u.role === 'owner');
    
    const testPGs = [
      {
        name: 'Luxury PG - Koramangala',
        description: 'Premium PG accommodation with modern amenities and excellent connectivity',
        owner: ownerUser._id,
        location: {
          address: '123, 5th Main Road, Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560034',
          coordinates: {
            type: 'Point',
            coordinates: [77.6208, 12.9352]
          }
        },
        contact: {
          phone: '9876543210',
          email: 'luxury@kormangala.com',
          whatsapp: '9876543210'
        },
        amenities: [
          'WiFi',
          'Food',
          'Laundry',
          'Security',
          'Parking',
          'Gym',
          'Housekeeping'
        ],
        rules: [
          'No smoking inside rooms',
          'Visitors allowed until 10 PM',
          'Monthly rent advance required'
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            caption: 'Living Room',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            caption: 'Bedroom',
            isPrimary: false
          }
        ],
        rooms: [
          {
            type: 'Single Sharing',
            totalRooms: 5,
            availableRooms: 2,
            price: 8000,
            capacity: 1,
            amenities: ['AC', 'Study Table', 'Wardrobe', 'Attached Bathroom']
          },
          {
            type: 'Double Sharing',
            totalRooms: 3,
            availableRooms: 1,
            price: 6000,
            capacity: 2,
            amenities: ['AC', 'Study Table', 'Wardrobe', 'Common Bathroom']
          }
        ],
        nearbyPlaces: [
          { name: 'Koramangala Metro Station', distance: '0.5 km' },
          { name: 'Forum Mall', distance: '1 km' },
          { name: 'St. Johns Medical College', distance: '2 km' }
        ],
        rating: 4.5,
        totalReviews: 23,
        status: 'active',
        isActive: true
      },
      {
        name: 'Comfort Stay - HSR Layout',
        description: 'Affordable PG with all basic amenities for students and working professionals',
        owner: ownerUser._id,
        location: {
          address: '456, 14th Main, HSR Layout',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560102',
          coordinates: {
            type: 'Point',
            coordinates: [77.6388, 12.9101]
          }
        },
        contact: {
          phone: '9876543212',
          email: 'comfort@hsr.com',
          whatsapp: '9876543212'
        },
        amenities: [
          'WiFi',
          'Food',
          'Laundry',
          'Security',
          'Parking'
        ],
        rules: [
          'No alcohol allowed',
          'Quiet hours after 10 PM',
          'ID proof mandatory'
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1611892440177-821a974b8513?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            caption: 'PG Building',
            isPrimary: true
          }
        ],
        rooms: [
          {
            type: 'Triple Sharing',
            totalRooms: 4,
            availableRooms: 2,
            price: 4500,
            capacity: 3,
            amenities: ['Study Table', 'Wardrobe', 'Common Bathroom']
          }
        ],
        nearbyPlaces: [
          { name: 'HSR BDA Complex', distance: '0.3 km' },
          { name: 'Agara Lake', distance: '1 km' },
          { name: 'Bommanahalli Metro', distance: '2 km' }
        ],
        rating: 4.3,
        totalReviews: 15,
        status: 'active',
        isActive: true
      },
      {
        name: 'Premium PG - Indiranagar',
        description: 'Luxury PG with premium amenities and excellent location',
        owner: ownerUser._id,
        location: {
          address: '789, 100 Feet Road, Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560038',
          coordinates: {
            type: 'Point',
            coordinates: [77.6402, 12.9784]
          }
        },
        contact: {
          phone: '9876543213',
          email: 'premium@indiranagar.com',
          whatsapp: '9876543213'
        },
        amenities: [
          'WiFi',
          'Food',
          'Laundry',
          'Security',
          'Parking',
          'Gym',
          'Pool',
          'Housekeeping',
          'Recreation Room'
        ],
        rules: [
          'Professional dress code',
          'No pets allowed',
          'Monthly payment in advance'
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            caption: 'Premium Room',
            isPrimary: true
          }
        ],
        rooms: [
          {
            type: 'Single Room',
            totalRooms: 3,
            availableRooms: 1,
            price: 12000,
            capacity: 1,
            amenities: ['AC', 'Study Table', 'Wardrobe', 'Attached Bathroom', 'Mini Fridge']
          },
          {
            type: 'Double Sharing',
            totalRooms: 2,
            availableRooms: 0,
            price: 8000,
            capacity: 2,
            amenities: ['AC', 'Study Table', 'Wardrobe', 'Attached Bathroom']
          }
        ],
        nearbyPlaces: [
          { name: 'Indiranagar Metro', distance: '0.2 km' },
          { name: 'CMH Road', distance: '0.5 km' },
          { name: 'MG Road', distance: '3 km' }
        ],
        rating: 4.7,
        totalReviews: 31,
        status: 'active',
        isActive: true
      }
    ];

    const createdPGs = await PG.insertMany(testPGs);
    console.log('Created test PGs:', createdPGs.length);

    // Generate QR codes for each PG
    const { generatePGQRCode } = require('../utils/qrCode');
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    for (const pg of createdPGs) {
      try {
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
      } catch (error) {
        console.error(`Failed to generate QR code for ${pg.name}:`, error);
      }
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📱 Test Login Details:');
    console.log('\n👤 User Account:');
    console.log('Email: john@example.com');
    console.log('Password: password123');
    console.log('Role: user');
    
    console.log('\n🏠 Owner Account:');
    console.log('Email: owner@example.com');
    console.log('Password: password123');
    console.log('Role: owner');
    
    console.log('\n🏢 Created PGs:');
    createdPGs.forEach((pg, index) => {
      console.log(`${index + 1}. ${pg.name} - ${pg.location.city} - ₹${pg.rooms[0]?.price || 'N/A'}/month`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
