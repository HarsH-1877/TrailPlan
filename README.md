# 🌍 TrailPlan - Intelligent Budget-First Travel Planner

> **Plan. Optimize. Go.**

TrailPlan is a modern travel planning application that creates personalized itineraries with intelligent budget optimization, real-time cost estimation, and visual timeline representation. Get complete trip plans with optimized flights, hotels, and activities - all tailored to your budget.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://trailplan.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ Features

### 💰 Budget-First Planning
- **Intelligent Budget Analysis**: Determines if your budget is realistic before generating itineraries
- **Remaining Budget Calculation**: Deducts flight costs automatically and plans hotels/activities within what's left
- **Smart Cost Optimization**: Finds the best value hotels and activities that fit your budget
- **Real-Time Price Validation**: Uses actual booking.com price ranges to prevent unrealistic estimates
- **Visual Budget Tracking**: Interactive budget meters with over-budget warnings

### ✈️ Complete Trip Planning
- **Automated Flight Estimation**: Accurate flight cost predictions based on distance and route
- **Multi-City Routing**: Optimizes travel routes across multiple destinations
- **Hotel Selection**: Prioritizes budget hotels (3-star, hostels, guesthouses) matching your requirements
- **Activity Recommendations**: Curated activities, sightseeing, dining, and experiences per destination
- **Day-by-Day Itinerary**: Comprehensive breakdown of your entire trip

### 📅 Visual Timeline
- **Day-by-Day Breakdown**: See your entire trip at a glance
- **Activity Categorization**: Flights, hotels, activities, meals with color-coded timeline
- **Booking Integration**: Direct links to Google Flights and Booking.com
- **PDF Export**: Download your complete itinerary as a professional PDF

### 🔐 User Management
- **Firebase Authentication**: Secure Google Sign-In
- **Trip Persistence**: Save and manage multiple trips
- **Personal Trip Library**: Access your saved itineraries anytime

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Premium, modern interface
- **Dark Mode**: Eye-friendly design with elegant color schemes
- **Responsive Layout**: Seamless experience across all devices
- **Smooth Animations**: Lottie animations for delightful loading states

## 🛠️ Tech Stack

### Frontend
- **Vite** - Lightning-fast build tool
- **Vanilla JavaScript** - No framework bloat
- **CSS3** - Custom design system with CSS variables
- **Firebase SDK** - Authentication and Firestore
- **html2canvas & jsPDF** - PDF generation
- **Lottie Player** - Animated loading states

### Backend
- **Node.js + Express** - RESTful API server
- **Google Gemini** - Intelligent itinerary generation engine
- **Flight Estimator** - Real-time flight cost estimation
- **Geocoding Service** - Location validation and processing

### Infrastructure
- **Render** - Cloud deployment (frontend + backend)
- **Firebase** - Authentication and database
- **GitHub** - Version control and CI/CD

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/HarsH-1877/TrailPlan.git
cd TrailPlan
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

4. **Configure environment variables**

Create `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Create `src/firebase/config.js`:
```javascript
export const firebaseConfig = {
  apiKey: "your_firebase_api_key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id"
};
```

5. **Run the application**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
cd backend
node server.js
```

6. **Open your browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
TrailPlan/
├── public/                    # Static assets
│   ├── logo.png              # Main logo
│   ├── logo-timeline.png     # Timeline logo
│   ├── loading.lottie        # Loading animation
│   └── images/               # Hero backgrounds, icons
├── src/                       # Frontend source
│   ├── components/           # Reusable components
│   │   └── navbar.js
│   ├── pages/                # Page components
│   │   ├── landing.js
│   │   ├── trip-form.js
│   │   ├── timeline.js
│   │   └── my-trips.js
│   ├── firebase/             # Firebase setup
│   │   ├── config.js
│   │   ├── auth.js
│   │   └── trips.js
│   ├── services/             # API services
│   │   └── api-service.js
│   ├── utils/                # Utility functions
│   ├── router.js             # Client-side routing
│   ├── main.js               # App entry point
│   └── style.css             # Global styles
├── backend/                   # Backend server
│   ├── routes/
│   │   └── itinerary.js      # Itinerary generation
│   ├── services/
│   │   ├── flight-estimator.js
│   │   └── geocoding-service.js
│   ├── utils/
│   │   ├── gemini-prompts.js # AI prompt engineering
│   │   └── haversine.js      # Distance calculations
│   └── server.js             # Express server
├── index.html                # HTML entry point
├── package.json
└── README.md
```

## 🎯 Usage

### Creating a Trip

1. **Sign In**: Click "Sign In" and authenticate with Google
2. **Create Trip**: Click "Start Your Trip" or "Create Trip"
3. **Fill Details**:
   - Trip name and dates
   - Start location and destinations
   - Number of travelers (adults, children, infants)
   - Budget and currency
4. **Generate**: Click "Generate Itinerary"
5. **Review**: Explore your personalized timeline with booking links
6. **Save**: Save to your trip library for future reference
7. **Export**: Download as PDF for offline access

### Key Features in Action

**Budget Feasibility Analysis**
- System calculates minimum viable cost for your trip
- Determines if budget is realistic or impossible
- Only exceeds budget for genuinely impossible scenarios (e.g., ₹30k Mumbai→Switzerland)

**Smart Hotel Selection**
- Prioritizes budget hotels (3-star, hostels, guesthouses)
- Uses real booking.com pricing
- Accounts for multiple rooms for groups
- Deduplicates hotels across days

**Visual Timeline**
- Day-by-day itinerary with activities
- Color-coded event types
- Budget breakdown per day
- Direct booking links

## 🔧 Configuration

### Environment Variables

**Backend (`backend/.env`)**:
- `GEMINI_API_KEY` - Your Google Gemini API key
- `FRONTEND_URL` - Frontend URL for CORS (default: `http://localhost:5173`)
- `NODE_ENV` - Environment (`development` or `production`)

**Frontend Firebase (`src/firebase/config.js`)**:
- Firebase project configuration object

### API Keys Required

1. **Google Gemini API**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Firebase Project**: Create at [Firebase Console](https://console.firebase.google.com/)

## 🌐 Deployment

### Frontend (Render Static Site)
- Build Command: `npm run build`
- Publish Directory: `dist`
- Auto-deploy on push to `main` branch

### Backend (Render Web Service)
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && node server.js`
- Environment Variables: Add `GEMINI_API_KEY`, `FRONTEND_URL`

## 🧪 Testing

Run the development servers and test:

1. **Homepage**: Load landing page, check animations
2. **Authentication**: Sign in with Google
3. **Trip Creation**: Fill form, validate inputs
4. **Itinerary Generation**: Generate trip, check AI response
5. **Timeline**: Review visual timeline, test booking links
6. **PDF Export**: Download itinerary
7. **Trip Management**: Save and retrieve trips
8. **Navigation**: Test all page transitions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Harsh**
- GitHub: [@HarsH-1877](https://github.com/HarsH-1877)
- Project Link: [https://github.com/HarsH-1877/TrailPlan](https://github.com/HarsH-1877/TrailPlan)

## 🙏 Acknowledgments

- [Google Gemini](https://deepmind.google/technologies/gemini/) for intelligent trip generation
- [Firebase](https://firebase.google.com/) for authentication and database
- [Lottie](https://lottiefiles.com/) for beautiful animations
- [Render](https://render.com/) for seamless deployment

---

**Made with ❤️ for travelers worldwide**