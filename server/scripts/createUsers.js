const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

const testUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'PG Owner',
    email: 'owner@example.com',
    phone: '9876543211',
    password: 'password123',
    role: 'owner'
  }
];

async function createUsers() {
  try {
    console.log('Creating test users...');
    
    for (const user of testUsers) {
      try {
        const response = await axios.post(`${API_BASE}/auth/register`, user);
        
        if (response.data.success) {
          console.log(`\n${user.role.toUpperCase()} Created Successfully:`);
          console.log(`  Name: ${user.name}`);
          console.log(`  Email: ${user.email}`);
          console.log(`  Phone: ${user.phone}`);
          console.log(`  Password: ${user.password}`);
          console.log(`  Role: ${user.role}`);
        }
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
          console.log(`\n${user.role.toUpperCase()} Already Exists:`);
          console.log(`  Email: ${user.email}`);
          console.log(`  Password: ${user.password}`);
        } else {
          console.error(`Error creating ${user.email}:`, error.response?.data || error.message);
        }
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('LOGIN CREDENTIALS:');
    console.log('='.repeat(50));
    console.log('\nUSER ACCOUNT:');
    console.log('Email: john@example.com');
    console.log('Password: password123');
    console.log('Role: user');
    
    console.log('\nOWNER ACCOUNT:');
    console.log('Email: owner@example.com');
    console.log('Password: password123');
    console.log('Role: owner');
    
    console.log('\n' + '='.repeat(50));
    console.log('You can now use these credentials to login!');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createUsers();
