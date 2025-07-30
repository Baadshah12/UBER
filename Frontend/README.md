# 🚗 Uber-Like Ride Booking App - Frontend

A modern, responsive React-based frontend for a ride booking application with real-time tracking, voice commands, and seamless user experience.

## ✨ Features

### 🎯 Core Features
- **Real-time Ride Booking**: Book rides with live location tracking
- **Voice Commands**: Book rides using voice commands for hands-free operation
- **Live GPS Tracking**: Real-time location updates for users and drivers
- **Multiple Vehicle Types**: Support for car, auto-rickshaw, and motorcycle
- **Smart Address Recognition**: Automatic geocoding and address suggestions
- **OTP Verification**: Secure ride confirmation with OTP
- **Real-time Notifications**: Live updates on ride status

### 🎨 User Interface
- **Modern Design**: Clean, intuitive interface with smooth animations
- **Responsive Layout**: Works seamlessly on mobile and desktop
- **Interactive Maps**: Google Maps integration with live tracking
- **Smooth Animations**: GSAP-powered transitions and micro-interactions
- **Dark/Light Theme**: Adaptive design elements

### 🔧 Technical Features
- **React 19**: Latest React with modern hooks and features
- **Vite**: Fast development and build tooling
- **Socket.io**: Real-time communication
- **Tailwind CSS**: Utility-first styling
- **GSAP**: Advanced animations
- **Google Maps API**: Location services and mapping

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_BASE_URL=http://localhost:5000
   VITE_GOOGLE_MAPS_API=your_google_maps_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎤 Voice Commands

### How to Use Voice Booking
1. Click the **"Book by Voice"** button on the home screen
2. Speak your destination and vehicle type in one sentence
3. The system will automatically:
   - Detect your current location
   - Parse your voice command
   - Book the ride with available drivers

### Supported Voice Commands
```
"[destination] [vehicle type]"
```

**Valid Vehicle Types:**
- `car` - for a car ride
- `auto` - for an auto-rickshaw/tuk-tuk
- `moto` - for a motorcycle

**Example Commands:**
- "Central Park car"
- "Airport auto"
- "Shopping mall moto"
- "Restaurant car"
- "Home auto"

## 📱 User Flows

### For Passengers
1. **Sign Up/Login**: Create account or sign in
2. **Book Ride**: 
   - Manual: Enter pickup and destination addresses
   - Voice: Use voice commands for hands-free booking
3. **Select Vehicle**: Choose from car, auto, or motorcycle
4. **Confirm Ride**: Review fare and confirm booking
5. **Track Ride**: Real-time tracking with driver details
6. **Complete Ride**: OTP verification and payment

### For Drivers (Captains)
1. **Sign Up/Login**: Register as a driver with vehicle details
2. **Receive Requests**: Get notified of nearby ride requests
3. **Accept Rides**: Review and accept ride requests
4. **Navigate**: Use integrated maps for navigation
5. **Complete Rides**: Verify OTP and mark ride completion

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CaptainDetails.jsx
│   ├── ConfirmRide.jsx
│   ├── FinishRide.jsx
│   ├── LiveTracking.jsx
│   ├── LocationSearchPanel.jsx
│   ├── LookingForDriver.jsx
│   ├── RidePopUp.jsx
│   ├── VehiclePanel.jsx
│   └── WaitingForDriver.jsx
├── context/            # React context providers
│   ├── CaptainContext.jsx
│   ├── SocketContext.jsx
│   └── UserContext.jsx
├── pages/              # Main application pages
│   ├── CaptainHome.jsx
│   ├── CaptainRiding.jsx
│   ├── Home.jsx
│   ├── Riding.jsx
│   ├── Start.jsx
│   └── User/Captain auth pages
└── assets/             # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Integration

The frontend communicates with the backend through:
- **REST API**: For user authentication, ride booking, and data management
- **Socket.io**: For real-time updates, location tracking, and notifications
- **Google Maps API**: For geocoding, directions, and map rendering

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable styled components
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: GSAP for advanced animations

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route guards for authenticated users
- **Input Validation**: Client-side form validation
- **HTTPS Ready**: Secure communication protocols

## 📱 Browser Support

- Chrome (recommended for voice features)
- Firefox
- Safari
- Edge

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set environment variables
3. Deploy automatically on push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

**Built with ❤️ using React, Vite, and modern web technologies**
