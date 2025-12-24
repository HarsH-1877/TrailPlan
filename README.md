# TrailPlan - Travel Planning Platform

**Plan. Optimize. Go.**

TrailPlan is a travel planning web platform that builds fully optimized timeline itineraries and total trip cost estimates from user inputs. Consolidate flights, hotels, transport, activities, and more into a visual day-by-day timeline with budget optimization.

![TrailPlan Hero](hero-preview.png)

## 🚀 Features

### ✨ Core Functionality
- **Intelligent Itinerary Generation**: Enter your trip details and get a fully optimized day-by-day plan
- **Budget Optimization**: Heuristic algorithm that optimizes for cost, comfort, or experience
- **Visual Timeline**: Beautiful day-by-day visualization with color-coded events
- **Budget Tracking**: Real-time budget meter showing spend vs. total budget
- **Multiple Booking Options**: See selected items plus 2-3 alternatives for each
- **Comprehensive Cost Breakdown**: Flights, hotels, activities, food, transfers, taxes, and contingency

### 📋 Trip Input Features
- Location autocomplete (20+ major destinations)
- Flexible date selection
- Traveler management (adults, children, infants)
- Interactive budget slider ($500 - $50,000)
- Multi-currency support (USD, EUR, GBP, JPY, INR)
- Travel style preferences (Budget / Comfort / Luxury / Fastest)
- Optimization goals (Cost / Experience / Time)
- Travel restrictions (max stops, hotel rating, airline preferences)
- Special needs (wheelchair, pet-friendly, dietary)

### 🎨 Design
- Modern dark theme with orange gradient accents
- Glassmorphism effects
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)
- Premium aesthetic inspired by VoyageFlow

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Build Tool**: Vite
- **Routing**: Client-side hash-based SPA routing
- **Styling**: Vanilla CSS with CSS custom properties
- **Fonts**: Inter (Google Fonts)
- **Data**: Mock data layer (ready for API integration)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/trailplan.git
cd trailplan

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will run at `http://localhost:5173`

## 📁 Project Structure

```
TrailPlan/
├── index.html              # Root HTML with SEO meta tags
├── package.json            # Dependencies and scripts
├── src/
│   ├── main.js             # App entry point, router initialization
│   ├── router.js           # Client-side SPA router
│   ├── style.css           # Global design system (700+ lines)
│   ├── components/
│   │   ├── common.js       # Reusable UI components
│   │   └── navbar.js       # Navigation component
│   ├── pages/
│   │   ├── landing.js      # Landing page with hero, how-it-works, testimonials
│   │   ├── trip-form.js    # Trip input form (8 sections, 40+ fields)
│   │   └── timeline.js     # Timeline visualization page
│   ├── data/
│   │   └── mock-data.js    # Mock flights, hotels, activities + optimizer
│   └── utils/              # (Future utilities)
├── public/
│   └── images/             # Static assets
└── docs/                   # Documentation
```

## 🎯 User Flow

1. **Landing Page** → User sees compelling hero and value proposition
2. **Trip Form** → User enters trip details (destination, dates, budget, preferences)
3. **Timeline Page** → App generates optimized itinerary with visual timeline and cost breakdown

## 🧪 Features Demonstrated

### Implemented ✅
- ✅ Landing page with hero, 3-step explainer, testimonials
- ✅ Trip input form with 8 sections and 40+ fields
- ✅ Location autocomplete
- ✅ Budget slider with currency support
- ✅ Travel preference selection
- ✅ Timeline visualization with day-by-day itinerary
- ✅ Budget meter and cost tracking
- ✅ Booking cards for flights, hotels, activities
- ✅ Price breakdown accordion
- ✅ Recommendations panel
- ✅ Mock data layer with realistic options
- ✅ Budget optimization algorithm
- ✅ Fully responsive design

### Coming Soon 🚧
- Item detail modals with images and reviews
- View alternates functionality
- Drag-and-drop timeline reordering
- LocalStorage trip persistence
- PDF export
- Real API integration (flights, hotels, activities)
- User accounts and saved trips
- Payment integration
- Explore page with map view
- Budget visualization charts

## 💾 Mock Data

The current version uses realistic mock data for demonstration:
- **Flights**: 3 options (major airlines, varying prices/times)
- **Hotels**: 3 options (4-4.5 stars, Paris locations)
- **Activities**: 6 options (Eiffel Tower, Louvre, Seine cruise, Versailles, etc.)
- **Transfers**: Airport and city transfers

### Budget Optimization
The algorithm selects the best options based on:
- **Travel Style**: Budget (cheapest), Comfort (mid-range), Luxury (premium)
- **Optimize For**: Cost, Experience, or Time
- **Constraints**: Max stops, minimum hotel rating, airline preferences

**Cost Calculation**:
- Flights × travelers
- Hotel × nights
- Activities × travelers
- Transfers (fixed)
- Food estimate (style-dependent: $25-$100/day/person)
- + Contingency (8%)
- + Taxes & Fees (5%)

## 🔌 API Integration (Future)

The project is structured for easy API integration:

### Recommended Providers
- **Flights**: Amadeus, Skyscanner API, Kiwi.com
- **Hotels**: Booking.com API, Expedia API, Hotels.com
- **Activities**: Viator API, GetYourGuide API, Klook
- **Maps & Geocoding**: Google Maps API, Mapbox
- **Currency**: Fixer.io, exchangerate-api.com

### Integration Steps
1. Sign up for API keys from providers
2. Create backend proxy (Node.js/Express) to protect API keys
3. Implement API abstraction layer (already structured in `/api`)
4. Add loading states and error handling
5. Implement caching to reduce costs

## 🎨 Design System

### Colors
- **Backgrounds**: `#0a0a0a`, `#141414`, `#1a1a1a`
- **Brand Gradient**: `#ff7b3d` → `#ff9654`
- **Text**: `#ffffff`, `#b8b8b8`, `#808080`
- **Timeline Events**: Purple (travel), Blue (hotel), Green (activities), Gray (buffer)

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: 12px - 72px (xs to 7xl)
- **Weights**: 300 - 900

### Components
- Buttons (Primary, Secondary, Outline, Icon)
- Cards (Default, Glass, Elevated)
- Inputs (Text, Select, Range, Number)
- Modals (Backdrop, Header, Body, Footer)

## 📊 Performance

- **Time-to-first-plan**: < 5 seconds (all client-side)
- **Timeline render**: Instant (no API calls)
- **Budget recalculation**: Real-time (client-side math)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work*

## 🙏 Acknowledgments

- Design inspiration from VoyageFlow
- Icons from system emojis
- Fonts from Google Fonts (Inter)

## 📧 Contact

For questions or feedback, please open an issue or contact [your-email@example.com]

---

**Built with ❤️ for travelers around the world**
