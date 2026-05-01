# PG Desk Server API

A comprehensive backend API for PG accommodation management system.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Separate profiles for users and PG owners
- **PG Management**: CRUD operations for PG properties with advanced filtering
- **Booking System**: Complete booking lifecycle with payment tracking
- **Dashboard Analytics**: Real-time statistics and revenue tracking
- **Search & Discovery**: Advanced search with filters and sorting
- **Review System**: User ratings and reviews for PGs

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start MongoDB server

5. Run the application:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pg_desk
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### PG Management

- `GET /api/pg` - Get all PGs with filters
- `GET /api/pg/:id` - Get single PG
- `POST /api/pg` - Create new PG (Owner only)
- `PUT /api/pg/:id` - Update PG (Owner only)
- `DELETE /api/pg/:id` - Delete PG (Owner only)
- `GET /api/pg/cities/list` - Get cities with PG count
- `POST /api/pg/:id/review` - Add review

### Bookings

- `POST /api/booking` - Create booking (User only)
- `GET /api/booking` - Get user bookings
- `GET /api/booking/:id` - Get single booking
- `PUT /api/booking/:id/status` - Update booking status
- `POST /api/booking/:id/payment` - Add payment

### User Routes

- `GET /api/user/dashboard` - User dashboard
- `GET /api/user/payments` - Payment history
- `GET /api/user/favorites` - Get favorites
- `POST /api/user/favorites` - Add to favorites
- `DELETE /api/user/favorites/:pgId` - Remove from favorites

### Owner Routes

- `GET /api/owner/dashboard` - Owner dashboard
- `GET /api/owner/properties` - Get owner properties
- `GET /api/owner/bookings` - Get property bookings
- `GET /api/owner/tenants` - Get tenants
- `GET /api/owner/revenue` - Revenue analytics
- `PUT /api/owner/property/:id/status` - Update property status

## Data Models

### User

```javascript
{
  name: String,
  email: String,
  phone: String,
  password: String,
  role: ['user', 'owner'],
  avatar: String,
  dateOfBirth: Date,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  isVerified: Boolean,
  lastLogin: Date
}
```

### PG

```javascript
{
  name: String,
  owner: ObjectId,
  description: String,
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: { latitude: Number, longitude: Number }
  },
  contact: {
    phone: String,
    email: String,
    alternatePhone: String
  },
  images: [{ url: String, public_id: String, caption: String }],
  amenities: [{ name: String, icon: String, included: Boolean }],
  rooms: [{
    type: ['single', 'double', 'triple', 'four'],
    totalRooms: Number,
    availableRooms: Number,
    price: Number,
    size: String,
    features: [String]
  }],
  gender: ['male', 'female', 'both'],
  pricing: {
    securityDeposit: Number,
    noticePeriod: Number,
    advancePayment: Number
  },
  rating: { average: Number, count: Number }
}
```

### Booking

```javascript
{
  user: ObjectId,
  pg: ObjectId,
  roomType: String,
  checkInDate: Date,
  checkOutDate: Date,
  duration: Number,
  monthlyRent: Number,
  totalAmount: Number,
  securityDeposit: Number,
  advanceAmount: Number,
  status: ['pending', 'confirmed', 'active', 'cancelled', 'completed'],
  paymentStatus: ['pending', 'partial', 'paid', 'refunded'],
  payments: [{
    type: ['advance', 'security', 'monthly', 'refund'],
    amount: Number,
    status: ['pending', 'completed', 'failed'],
    paymentId: String,
    paymentMethod: String,
    paidAt: Date,
    dueDate: Date
  }]
}
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- Role-based authorization

## Error Handling

The API uses consistent error responses:

```javascript
{
  success: false,
  message: "Error description",
  errors: [] // Validation errors (if any)
}
```

## Development

The server includes comprehensive error handling, logging, and validation. All routes are protected with appropriate authentication and authorization middleware.

## License

MIT License
