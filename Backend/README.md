# 🚗 Uber-Like Ride Booking App - Backend

A robust Node.js backend for a ride booking application with real-time features, authentication, and location services.

## ✨ Features

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication for users and drivers
- **Password Hashing**: Bcrypt encryption for secure password storage
- **Token Blacklisting**: Secure logout with token invalidation
- **Input Validation**: Comprehensive request validation with express-validator

### 🚗 Ride Management
- **Real-time Ride Booking**: Instant ride creation and assignment
- **Location Services**: GPS tracking and geocoding with Google Maps API
- **Fare Calculation**: Dynamic pricing based on distance and vehicle type
- **OTP Verification**: Secure ride confirmation system
- **Ride Status Tracking**: Complete ride lifecycle management

### 📍 Location & Maps
- **Google Maps Integration**: Geocoding, directions, and distance calculation
- **Real-time Location Updates**: Live GPS tracking for users and drivers
- **Address Suggestions**: Autocomplete for pickup and destination addresses
- **Reverse Geocoding**: Convert coordinates to readable addresses

### 🔄 Real-time Communication
- **Socket.io Integration**: Real-time updates and notifications
- **Live Tracking**: Real-time location sharing between users and drivers
- **Instant Notifications**: Push notifications for ride status changes
- **Bidirectional Communication**: Seamless user-driver interaction

### 🚙 Driver Management
- **Captain Registration**: Complete driver onboarding system
- **Vehicle Management**: Support for multiple vehicle types
- **Location-based Matching**: Find nearby drivers using geospatial queries
- **Earnings Tracking**: Fare calculation and payment processing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Google Maps API key
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/uber-clone
   JWT_SECRET=your_jwt_secret_key_here
   GOOGLE_MAPS_API=your_google_maps_api_key_here
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

5. **Verify installation**
   Navigate to `http://localhost:5000` - you should see the server running

## 🏗️ Project Structure

```
Backend/
├── controllers/         # Request handlers
│   ├── captain.controller.js
│   ├── map.controller.js
│   ├── ride.controller.js
│   └── user.controller.js
├── models/             # Database models
│   ├── captain.model.js
│   ├── ride.model.js
│   ├── user.model.js
│   └── blacklistToken.model.js
├── routes/             # API routes
│   ├── captain.routes.js
│   ├── maps.routes.js
│   ├── ride.routes.js
│   └── user.routes.js
├── services/           # Business logic
│   ├── captain.service.js
│   ├── maps.service.js
│   ├── ride.service.js
│   └── user.service.js
├── middlewares/        # Custom middleware
│   └── auth.middleware.js
├── db/                 # Database connection
│   └── db.js
├── socket.js           # Socket.io configuration
├── app.js             # Express app setup
└── server.js          # Server entry point
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (if configured)

## 📡 API Endpoints

### 🔐 Authentication

#### User Registration
```http
POST /users/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "password123"
}
```

#### User Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Captain Registration
```http
POST /captains/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "Mike",
    "lastname": "Driver"
  },
  "email": "mike@example.com",
  "password": "password123",
  "vehicle": {
    "color": "White",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### 🚗 Ride Management

#### Create Ride
```http
POST /rides/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "pickupLocation": "123 Main St, City",
  "dropLocation": "456 Oak Ave, City",
  "vehicleType": "car"
}
```

#### Get Fare Estimate
```http
GET /rides/getFare?pickupLocation=123 Main St&dropLocation=456 Oak Ave&vehicleType=car
Authorization: Bearer <token>
```

#### Confirm Ride (Captain)
```http
POST /rides/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "rideId": "ride_id_here"
}
```

#### Start Ride
```http
POST /rides/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "rideId": "ride_id_here",
  "otp": "1234"
}
```

### 📍 Location Services

#### Get Address Suggestions
```http
GET /maps/get-suggestions?input=main street
Authorization: Bearer <token>
```

#### Get Coordinates from Address
```http
GET /maps/get-coordinates?address=123 Main St, City
Authorization: Bearer <token>
```

## 🔄 Socket.io Events

### Client to Server
- `join` - Join user/captain room
- `update-location-user` - Update user location
- `update-location-captain` - Update captain location

### Server to Client
- `new-ride` - New ride request for captain
- `ride-confirmed` - Ride confirmed by captain
- `ride-started` - Ride started
- `ride-completed` - Ride completed

## 🗄️ Database Models

### User Model
```javascript
{
  fullname: {
    firstname: String,
    lastname: String
  },
  email: String,
  password: String,
  location: {
    type: "Point",
    coordinates: [lng, lat]
  },
  socketid: String
}
```

### Captain Model
```javascript
{
  fullname: {
    firstname: String,
    lastname: String
  },
  email: String,
  password: String,
  vehicle: {
    color: String,
    plate: String,
    capacity: Number,
    vehicleType: String
  },
  location: {
    type: "Point",
    coordinates: [lng, lat]
  },
  socketId: String
}
```

### Ride Model
```javascript
{
  user: ObjectId,
  captain: ObjectId,
  pickupLocation: String,
  dropLocation: String,
  pickupAddress: String,
  dropAddress: String,
  fare: Number,
  status: String,
  otp: String,
  duration: Number,
  distance: Number
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption
- **Input Validation**: Express-validator for request validation
- **CORS Protection**: Cross-origin resource sharing configuration
- **Rate Limiting**: API rate limiting (if configured)
- **Environment Variables**: Secure configuration management

## 🌐 External APIs

### Google Maps API
- **Geocoding**: Convert addresses to coordinates
- **Reverse Geocoding**: Convert coordinates to addresses
- **Distance Matrix**: Calculate distance and duration
- **Places Autocomplete**: Address suggestions

## 📊 Performance Features

- **MongoDB Indexing**: Optimized database queries
- **Geospatial Queries**: Efficient location-based searches
- **Connection Pooling**: Database connection optimization
- **Caching**: Response caching (if configured)

## 🚀 Deployment

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uber-clone
JWT_SECRET=your_secure_jwt_secret
GOOGLE_MAPS_API=your_google_maps_api_key
NODE_ENV=production
```

### Production Deployment
1. **Set up MongoDB**: Configure production database
2. **Environment Variables**: Set all required environment variables
3. **Build and Deploy**: Use PM2 or similar process manager
4. **SSL Certificate**: Configure HTTPS for production
5. **Load Balancer**: Set up load balancing if needed

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

### API Testing
Use tools like Postman or Insomnia to test endpoints:
- Import the API collection
- Set up environment variables
- Run automated tests

### Load Testing
Use tools like Artillery or Apache Bench for load testing:
```bash
npm install -g artillery
artillery run load-test.yml
```

## 📈 Monitoring

### Health Check
```http
GET /health
```

### Logging
- **Console Logging**: Development logging
- **File Logging**: Production logging (if configured)
- **Error Tracking**: Error monitoring and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

**Built with ❤️ using Node.js, Express, MongoDB, and Socket.io**
