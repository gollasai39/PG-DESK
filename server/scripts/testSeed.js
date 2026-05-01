// Test data for manual database setup
// Copy this data to your MongoDB Atlas collection

const testUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+919876543210',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    role: 'user',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'PG Owner',
    email: 'owner@example.com',
    phone: '+919876543211',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    role: 'owner',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const testPGs = [
  {
    name: 'Luxury PG - Koramangala',
    description: 'Premium PG accommodation with modern amenities and excellent connectivity',
    owner: 'OWNER_ID_HERE', // Replace with actual owner _id from users collection
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
      phone: '+919876543210',
      email: 'luxury@kormangala.com',
      whatsapp: '+919876543210'
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
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Comfort Stay - HSR Layout',
    description: 'Affordable PG with all basic amenities for students and working professionals',
    owner: 'OWNER_ID_HERE', // Replace with actual owner _id
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
      phone: '+919876543212',
      email: 'comfort@hsr.com',
      whatsapp: '+919876543212'
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
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

console.log('📋 Test Users Data:');
console.log(JSON.stringify(testUsers, null, 2));

console.log('\n🏢 Test PGs Data:');
console.log(JSON.stringify(testPGs, null, 2));

console.log('\n🔑 Login Credentials:');
console.log('User: john@example.com / password123');
console.log('Owner: owner@example.com / password123');
console.log('\n📝 Instructions:');
console.log('1. Update your .env file with MongoDB Atlas connection string');
console.log('2. Run: node scripts/seedData.js');
console.log('3. Or manually insert this data in MongoDB Atlas');
