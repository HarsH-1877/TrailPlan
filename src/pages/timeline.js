import { Navbar, navbarStyles } from '../components/navbar.js';
import { generateMockItinerary } from '../data/mock-data.js';

export function TimelinePage() {
  // Get trip data from session storage with robust error handling
  let tripData = null;

  try {
    const tripDataStr = sessionStorage.getItem('tripData');
    console.log('📦 Raw sessionStorage data:', tripDataStr?.substring(0, 200) + '...');

    // Check if the value is the string "undefined" or actually null/undefined
    if (tripDataStr && tripDataStr !== 'undefined' && tripDataStr !== 'null') {
      tripData = JSON.parse(tripDataStr);
      console.log('✅ Parsed tripData keys:', Object.keys(tripData || {}));
      console.log('🔍 Has dailyItinerary?', !!tripData?.dailyItinerary);
      console.log('🔍 Has costBreakdown?', !!tripData?.costBreakdown);
    }
  } catch (e) {
    console.error('❌ Failed to parse tripData:', e);
  }

  let itinerary;
  if (tripData && tripData.dailyItinerary) {
    // Real API data from Gemini - process it
    console.log('✅ Processing REAL API data with dailyItinerary');
    itinerary = processApiItinerary(tripData);
    console.log('📊 Processed itinerary with costs:', itinerary.costs);
  } else if (tripData) {
    // Old format trip data - use mock itinerary
    console.log('⚠️ No dailyItinerary found - using MOCK data');
    itinerary = generateMockItinerary(tripData);
    console.log('📊 Using mock itinerary');
  } else {
    // No data - use defaults
    tripData = getDefaultTripData();
    itinerary = generateMockItinerary(tripData);
    console.log('📊 Using default itinerary');
  }

  // Ensure tripData has all required fields - READ FROM ACTUAL DATA
  console.log('💾 TripData received:', tripData);

  const safeData = {
    tripName: tripData.tripName || tripData.destinations?.[0] || 'My Trip',
    startDate: tripData.startDate || new Date().toISOString().split('T')[0],
    duration: parseInt(tripData.duration) || 7,
    adults: parseInt(tripData.adults) || 1,
    children: parseInt(tripData.children) || 0,
    infants: parseInt(tripData.infants) || 0,
    currency: tripData.currency || 'INR',
    budget: parseFloat(tripData.budget) || 5000  // CRITICAL: This must be user's actual budget
  };

  // CRITICAL FIX: Calculate using ACTUAL user values
  const totalTravelers = safeData.adults + safeData.children + safeData.infants;

  // Get total cost from api data
  const totalCost = (itinerary.costs && itinerary.costs.total) ? itinerary.costs.total :
    (tripData.costBreakdown && tripData.costBreakdown.total) ? tripData.costBreakdown.total : 0;

  // Budget percentage using ACTUAL user budget
  const budgetPercentage = safeData.budget > 0 ? Math.round((totalCost / safeData.budget) * 100) : 0;

  console.log('📊 Calculations:', { totalTravelers, totalCost, budget: safeData.budget, budgetPercentage });

  return `
    
    <div class="timeline-page">
      <!-- Top Summary Bar -->
      <div class="summary-bar">
        <div class="summary-container">
          <!-- Logo (clickable to home) -->
          <div class="timeline-logo" onclick="navigateTo('/')">
            <img src="/logo-timeline.png" alt="TrailPlan" />
          </div>
          
          <div class="summary-info">
            <h1 class="trip-name">${safeData.tripName}</h1>
            <div class="trip-meta">
              <span>${safeData.startDate}</span>
              <span class="dot">•</span>
              <span>${safeData.duration} days</span>
              <span class="dot">•</span>
              <span>${totalTravelers} travelers</span>
            </div>
          </div>
          
          <div class="budget-display">
            <div class="budget-label">Total Estimated Cost (per person)</div>
            <div class="budget-amount">${formatCurrency(totalCost, safeData.currency)}</div>
            <div class="budget-meter-container">
              <div class="budget-meter">
                <div class="budget-meter-fill ${budgetPercentage > 100 ? 'over-budget' : ''}" style="width: ${Math.min(budgetPercentage, 100)}%"></div>
              </div>
              <div class="budget-percentage ${budgetPercentage > 100 ? 'over-budget-text' : ''}">${budgetPercentage}% of budget${budgetPercentage > 100 ? ' ⚠️' : ''}</div>
            </div>
          </div>
          
          <div class="summary-actions">
            <button class="btn btn-secondary btn-sm" onclick="saveTrip()">
              Save
            </button>
            <button
              class="btn btn-secondary btn-sm"
              onclick="window.exportTimelinePDF()"
            >
              📄 Export PDF
            </button>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <!-- Timeline Export Container -->
      <div id="timeline-export">
      <div class="timeline-container">
        <!-- Left Panel - Timeline -->
        <div class="timeline-panel">
          <h2 class="panel-title">Your Itinerary</h2>
          
          <div class="timeline">
            ${generateTimelineHTML(safeData, itinerary)}
          </div>
        </div>
        
        <!-- Right Panel - Bookings & Recommendations -->
        <div class="sidebar-panel">
          <!-- Selected Bookings (Flights & Hotels only) -->
          <div class="panel-section">
            <h3 class="section-title">Your Bookings</h3>
            
            <!-- Flight Card -->
            <div class="booking-card">
              <div class="booking-header">
                <span class="booking-icon">✈️</span>
                <span class="booking-type">Flight</span>
                <span class="booking-price">${formatCurrency(itinerary.costs?.flights || 0, safeData.currency)}</span>
              </div>
              <div class="booking-details">
                <div class="booking-title">${itinerary.flight?.airline || 'Airline'} ${itinerary.flight?.flightNumber || ''}</div>
                <div class="booking-subtitle">${itinerary.flight?.from || 'Origin'} → ${itinerary.flight?.to || 'Destination'}</div>
                <div class="booking-meta">${itinerary.flight?.departTime || ''} - ${itinerary.flight?.arriveTime || ''} • ${itinerary.flight?.duration || ''}</div>
              </div>
              <div class="booking-actions">
                <a href="https://www.google.com/travel/flights" target="_blank" class="btn btn-outline btn-sm">View on Google Flights</a>
                <a href="${itinerary.flight?.bookingUrl || 'https://www.google.com/travel/flights'}" target="_blank" class="btn btn-primary btn-sm">Book Now</a>
              </div>
            </div>
            
            <!-- Hotel Cards (Multiple if needed) -->
            ${generateHotelBookingCards(itinerary.hotels || [], itinerary.costs?.hotel || 0, safeData)}
          </div>
          
          <!-- Activity Recommendations -->
          <div class="panel-section activity-discover-section">
            <h3 class="section-title"> Recommended Activities</h3>
            
            <!-- Search Box -->
            <div class="activity-search-box">
              <input type="text" id="activity-search" class="activity-search-input" placeholder="Search activities, tours, experiences..." oninput="filterActivities(this.value)">
              <span class="search-icon">🔍</span>
            </div>
            
            <!-- Category Pills -->
            <div class="activity-categories">
              <button class="category-pill active" onclick="filterByCategory('all', this)">All</button>
              <button class="category-pill" onclick="filterByCategory('sightseeing', this)">🏛️ Sightseeing</button>
              <button class="category-pill" onclick="filterByCategory('food', this)">🍽️ Food & Drink</button>
              <button class="category-pill" onclick="filterByCategory('adventure', this)">🎿 Adventure</button>
              <button class="category-pill" onclick="filterByCategory('culture', this)">🎭 Culture</button>
              <button class="category-pill" onclick="filterByCategory('nature', this)">🌿 Nature</button>
            </div>
            
            <!-- Recommended Activities List -->
            <div class="activity-recommendations" id="activity-list">
              ${generateActivityRecommendations(itinerary.activities || [], safeData)}
            </div>
          </div>
          
          <!-- Price Breakdown -->
          <div class="panel-section price-breakdown-section">
            <details class="price-breakdown" open>
              <summary class="breakdown-header">
                <span class="breakdown-title">Price Breakdown</span>
                <span class="breakdown-arrow">▼</span>
              </summary>
              <div class="breakdown-content">
                <div class="breakdown-item">
                  <span>✈️ Flights</span>
                  <span class="breakdown-price">${formatCurrency(itinerary.costs?.flights || 0, safeData.currency)}</span>
                </div>
                <div class="breakdown-item">
                  <span>🏨 Hotels</span>
                  <span class="breakdown-price">${formatCurrency(itinerary.costs?.hotel || 0, safeData.currency)}</span>
                </div>
                <div class="breakdown-item">
                  <span>🎯 Activities</span>
                  <span class="breakdown-price">${formatCurrency(itinerary.costs?.activities || 0, safeData.currency)}</span>
                </div>
                <div class="breakdown-item">
                  <span>🍽️ Food & Dining</span>
                  <span class="breakdown-price">${formatCurrency(itinerary.costs?.food || 0, safeData.currency)}</span>
                </div>
                <div class="breakdown-separator"></div>
                <div class="breakdown-item breakdown-total">
                  <span>Total Estimated</span>
                  <span class="breakdown-price">${formatCurrency(totalCost, safeData.currency)}</span>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div> <!-- Close timeline-export -->
    </div>
    
    ${timelinePageStyles}
  `;
}

// Process itinerary data from Gemini API
function processApiItinerary(apiData) {
  console.log('🔍 Processing API itinerary data:', apiData);

  // Extract cost breakdown from tripSummary.costBreakdown (Gemini's structure)
  const costs = {
    flights: apiData.tripSummary?.costBreakdown?.flights || apiData.costBreakdown?.flights || 0,
    hotel: apiData.tripSummary?.costBreakdown?.hotels || apiData.budgetSummary?.breakdown?.accommodation || 0,
    activities: apiData.tripSummary?.costBreakdown?.activities || apiData.budgetSummary?.breakdown?.activities || 0,
    food: apiData.tripSummary?.costBreakdown?.meals || apiData.budgetSummary?.breakdown?.meals || 0,
    total: 0
  };

  // Calculate total
  costs.total = costs.flights + costs.hotel + costs.activities + costs.food;

  console.log('💰 Extracted costs:', costs);

  // Extract ALL unique hotels from dailyItinerary
  const hotelsMap = new Map();
  const activities = [];

  if (apiData.dailyItinerary && Array.isArray(apiData.dailyItinerary)) {
    apiData.dailyItinerary.forEach((day, index) => {
      // Extract hotel for this day
      if (day.accommodation && day.accommodation.name && day.accommodation.name !== 'N/A') {
        // Normalize key: trim, lowercase, remove extra spaces to prevent duplicates
        const normalizedName = (day.accommodation.name || '').trim().toLowerCase().replace(/\s+/g, ' ');
        const normalizedLocation = (day.location || '').trim().toLowerCase().replace(/\s+/g, ' ');
        const hotelKey = `${normalizedName}-${normalizedLocation}`;

        if (!hotelsMap.has(hotelKey)) {
          hotelsMap.set(hotelKey, {
            id: `HT${hotelsMap.size + 1}`,
            name: day.accommodation.name,
            location: day.location,
            stars: 4,
            rating: day.accommodation.rating || 4.5,
            totalNights: day.accommodation.totalNights || 1,
            checkIn: '3:00 PM',
            checkOut: '11:00 AM',
            roomType: 'Standard Room',
            pricePerNight: day.accommodation.pricePerNight || 0,
            totalPrice: (day.accommodation.pricePerNight || 0) * (day.accommodation.totalNights || 1),
            bookingUrl: day.accommodation.bookingUrl || 'https://www.booking.com/hotels'
          });
        }
      }

      // Extract activities for this day
      if (day.activities && Array.isArray(day.activities)) {
        day.activities.forEach(act => {
          activities.push({
            id: `ACT${activities.length + 1}`,
            name: act.title || act.name || 'Activity',
            category: act.type || 'Experience',
            duration: act.duration || '2 hours',
            rating: 4.5,
            reviews: 100,
            price: act.estimatedCost || 0,
            image: getActivityEmoji(act.type),
            bestTime: act.time || 'Morning',
            bookingUrl: act.bookingUrl || null
          });
        });
      }
    });
  }

  const hotels = Array.from(hotelsMap.values());
  console.log(`🏨 Extracted ${hotels.length} unique hotel(s):`, hotels.map(h => h.name));

  // Use first hotel for legacy 'hotel' field (for backwards compatibility)
  const hotel = hotels[0] || {
    id: 'HT001',
    name: 'Hotel Information Unavailable',
    location: apiData.destinations?.[0] || 'Destination',
    stars: 4,
    rating: 4.5,
    totalNights: apiData.duration || 7,
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    roomType: 'Standard Room',
    pricePerNight: 0,
    bookingUrl: 'https://www.booking.com/hotels'
  };

  // Create flight object (keep for backwards compatibility)
  const flight = {
    id: 'FL001',
    airline: 'Selected Airline',
    flightNumber: 'XX000',
    from: apiData.startLocation || 'Origin',
    to: apiData.destinations?.[0] || 'Destination',
    departTime: '10:00 AM',
    arriveTime: '2:00 PM',
    duration: '4h 0m',
    stops: 0,
    price: costs.flights,
    bookingUrl: 'https://www.booking.com/flights'
  };

  return {
    flight,
    hotel,  // First hotel for backwards compatibility
    hotels,  // ALL hotels array
    activities: activities.length > 0 ? activities : getDefaultActivities(),
    costs,
    budgetPercentage: 100,  // Will be calculated in main function
    dailyItinerary: apiData.dailyItinerary || [],
    tripSummary: apiData.tripSummary,
    budgetSummary: apiData.budgetSummary
  };
}

function getActivityEmoji(type) {
  const emojiMap = {
    'sightseeing': '🏛️',
    'adventure': '🎿',
    'culture': '🎭',
    'nature': '🌿',
    'food': '🍽️',
    'shopping': '🛍️',
    'relaxation': '🧘',
    'entertainment': '🎉'
  };
  return emojiMap[type?.toLowerCase()] || '🎯';
}

function getDefaultActivities() {
  // Fix: Increased prices to realistic INR amounts (500-3500 range)
  return [
    { id: 'ACT001', name: 'City Walking Tour', category: 'sightseeing', duration: '3 hours', rating: 4.8, reviews: 2500, price: 1500, image: '🚶', bestTime: 'Morning', bookingUrl: 'https://www.viator.com' },
    { id: 'ACT002', name: 'Local Food Experience', category: 'food', duration: '2.5 hours', rating: 4.9, reviews: 1800, price: 2500, image: '🍴', bestTime: 'Afternoon', bookingUrl: 'https://www.viator.com' },
    { id: 'ACT003', name: 'Historic Landmarks Tour', category: 'sightseeing', duration: '4 hours', rating: 4.7, reviews: 3200, price: 2000, image: '🏛️', bestTime: 'Morning', bookingUrl: 'https://www.viator.com' },
    { id: 'ACT004', name: 'Wine Tasting Experience', category: 'food', duration: '3 hours', rating: 4.8, reviews: 1200, price: 3500, image: '🍷', bestTime: 'Afternoon', bookingUrl: 'https://www.viator.com' },
    { id: 'ACT005', name: 'Adventure Hiking Trip', category: 'adventure', duration: '6 hours', rating: 4.9, reviews: 890, price: 3000, image: '🥾', bestTime: 'Morning', bookingUrl: 'https://www.viator.com' },
    { id: 'ACT006', name: 'Museum & Art Gallery', category: 'culture', duration: '3 hours', rating: 4.6, reviews: 2100, price: 800, image: '🎨', bestTime: 'Afternoon', bookingUrl: 'https://www.viator.com' },
    { id: 'ACT007', name: 'Sunset Boat Cruise', category: 'nature', duration: '2 hours', rating: 4.9, reviews: 1500, price: 2200, image: '🚢', bestTime: 'Evening', bookingUrl: 'https://www.viator.com' },
    { id: 'ACT008', name: 'Cooking Class', category: 'food', duration: '4 hours', rating: 4.8, reviews: 980, price: 3200, image: '👨‍🍳', bestTime: 'Morning', bookingUrl: 'https://www.viator.com' },
    { id: 'ACT009', name: 'Night City Tour', category: 'sightseeing', duration: '3 hours', rating: 4.7, reviews: 1650, price: 1800, image: '🌃', bestTime: 'Evening', bookingUrl: 'https://www.viator.com' },
    { id: 'ACT010', name: 'Kayaking Adventure', category: 'adventure', duration: '3 hours', rating: 4.8, reviews: 720, price: 2500, image: '🚣', bestTime: 'Morning', bookingUrl: 'https://www.viator.com' },
    { id: 'ACT011', name: 'Theater Performance', category: 'culture', duration: '2.5 hours', rating: 4.9, reviews: 2800, price: 4000, image: '🎭', bestTime: 'Evening', bookingUrl: 'https://www.viator.com' },
    { id: 'ACT012', name: 'Garden & Park Tour', category: 'nature', duration: '2 hours', rating: 4.5, reviews: 1100, price: 500, image: '🌿', bestTime: 'Morning', bookingUrl: 'https://www.viator.com' }
  ];
}

// Generate HTML for activity recommendations
function generateActivityRecommendations(activities, tripData) {
  // Combine passed activities with default ones for recommendations
  const allActivities = [...(activities || []), ...getDefaultActivities()];

  // Remove duplicates by name
  const uniqueActivities = allActivities.filter((activity, index, self) =>
    index === self.findIndex(a => a.name === activity.name)
  );

  return uniqueActivities.map(activity => `
    <div class="activity-card" data-category="${(activity.category || 'experience').toLowerCase()}" data-name="${(activity.name || '').toLowerCase()}">
      <div class="activity-card-icon">${activity.image || getActivityEmoji(activity.category)}</div>
      <div class="activity-card-content">
        <div class="activity-card-title">${activity.name || 'Activity'}</div>
        <div class="activity-card-meta">
          <span class="activity-duration">⏱️ ${activity.duration || '2 hours'}</span>
          <span class="activity-rating">★ ${activity.rating || 4.5}</span>
        </div>
        <div class="activity-card-price">${formatCurrency(activity.price || 50, tripData.currency)}</div>
      </div>
      <div class="activity-card-actions">
        <button class="btn btn-sm btn-primary" onclick="addActivityToTrip('${activity.id}', '${activity.name}')">+ Add</button>
        <a href="${activity.bookingUrl || 'https://www.viator.com'}" target="_blank" class="activity-book-link">Book →</a>
      </div>
    </div>
  `).join('');
}

// Generate HTML for hotel booking cards (supports multiple hotels)
function generateHotelBookingCards(hotels, totalHotelCost, tripData) {
  if (!hotels || hotels.length === 0) {
    // Fallback: Show a single hotel card with no data
    return `
      <div class="booking-card">
        <div class="booking-header">
          <span class="booking-icon">🏨</span>
          <span class="booking-type">Hotel</span>
          <span class="booking-price">${formatCurrency(totalHotelCost, tripData.currency)}</span>
        </div>
        <div class="booking-details">
          <div class="booking-title">Hotel Information Pending</div>
          <div class="booking-subtitle">Location TBD</div>
          <div class="booking-meta">⭐⭐⭐⭐ • ${tripData.duration || 7} nights</div>
        </div>
          <div class="booking-actions">
            <a href="https://www.booking.com/hotels" target="_blank" class="btn btn-outline btn-sm">View on Booking.com</a>
            <a href="https://www.booking.com/hotels" target="_blank" class="btn btn-primary btn-sm">Book Now</a>
          </div>
      </div>
    `;
  }

  // Generate a card for each hotel
  return hotels.map((hotel, index) => `
    <div class="booking-card">
      <div class="booking-header">
        <span class="booking-icon">🏨</span>
        <span class="booking-type">Hotel ${hotels.length > 1 ? (index + 1) : ''}</span>
        <span class="booking-price">${formatCurrency(hotel.totalPrice || 0, tripData.currency)}</span>
      </div>
      <div class="booking-details">
        <div class="booking-title">${hotel.name || 'Hotel'}</div>
        <div class="booking-subtitle">${hotel.city || 'Location'}</div>
        <div class="booking-meta">
          ${'⭐'.repeat(hotel.stars || 4)} • ${hotel.totalNights || 1} nights • ★ ${hotel.rating || 4.5}
        </div>
        ${hotel.checkInDate && hotel.checkOutDate ? `
          <div class="booking-dates">
            📅 ${formatDate(hotel.checkInDate)} → ${formatDate(hotel.checkOutDate)}
          </div>
        ` : ''}
      </div>
        <div class="booking-actions">
          <a href="https://www.booking.com/hotels" target="_blank" class="btn btn-outline btn-sm">View on Booking.com</a>
          <a href="${hotel.bookingUrl || 'https://www.booking.com/hotels'}" target="_blank" class="btn btn-primary btn-sm">Book Now</a>
        </div>
    </div>
  `).join('');
}

// Helper function to format dates nicely
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function generateTimelineHTML(tripData, itinerary) {
  const days = tripData.duration || 7;
  const startDate = new Date(tripData.startDate || Date.now());
  let html = '';

  // Use dailyItinerary from API if available
  const dailyPlan = itinerary.dailyItinerary || [];

  for (let day = 1; day <= days; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day - 1);
    const dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Get day's plan from API data or use defaults
    const dayPlan = dailyPlan[day - 1] || null;

    html += `
      <div class="timeline-day day-color-${((day - 1) % 7) + 1}">
        <div class="day-header">
          <div class="day-label">DAY ${day} - ${dateStr.toUpperCase()}</div>
        </div>
        <div class="day-events">
    `;

    // Day 1: Flight + Hotel Check-in
    if (day === 1) {
      html += `
        <div class="timeline-event event-travel">
          <div class="event-icon">✈️</div>
          <div class="event-content">
            <div class="event-badge">Flight</div>
            <div class="event-title">${itinerary.flight?.from?.split('(')[0] || 'Origin'} → ${itinerary.flight?.to?.split('(')[0] || 'Destination'}</div>
            <div class="event-time">${itinerary.flight?.departTime || '10:00 AM'} - ${itinerary.flight?.arriveTime || '2:00 PM'}</div>
            <div class="event-meta">${itinerary.flight?.airline || 'Airline'} ${itinerary.flight?.flightNumber || ''}</div>
            <a href="${itinerary.flight?.bookingUrl || 'https://www.google.com/travel/flights'}" target="_blank" class="event-booking-link">🔗 Book Flight</a>
          </div>
        </div>
        
        <div class="timeline-event event-hotel">
          <div class="event-icon">🏨</div>
          <div class="event-content">
            <div class="event-badge">Check-in</div>
            <div class="event-title">${itinerary.hotel?.name || 'Hotel'}</div>
            <div class="event-time">${itinerary.hotel?.checkIn || '3:00 PM'}</div>
            <div class="event-meta">${itinerary.hotel?.roomType || 'Room'}</div>
            <a href="${itinerary.hotel?.bookingUrl || 'https://www.booking.com/hotels'}" target="_blank" class="event-booking-link">🔗 View Hotel</a>
          </div>
        </div>
      `;
    }

    // Detect hotel changes (check if hotel is different from previous day)
    const prevDayPlan = day > 1 ? dailyPlan[day - 2] : null;
    const currentHotel = dayPlan?.accommodation?.name;
    const prevHotel = prevDayPlan?.accommodation?.name;
    const hotelChanged = day > 1 && currentHotel && prevHotel && currentHotel !== prevHotel;

    // If hotel changed, show check-out from previous hotel
    if (hotelChanged) {
      html += `
        <div class="timeline-event event-hotel">
          <div class="event-icon">🏨</div>
          <div class="event-content">
            <div class="event-badge">Check-out</div>
            <div class="event-title">${prevHotel}</div>
            <div class="event-time">11:00 AM</div>
            <div class="event-meta">${prevDayPlan?.location || ''}</div>
          </div>
        </div>
      `;
    }

    // If hotel changed, add travel to new location + check-in BEFORE activities
    if (hotelChanged) {
      // Travel to new location
      html += `
        <div class="timeline-event event-travel">
          <div class="event-icon">🚗</div>
          <div class="event-content">
            <div class="event-badge">Travel</div>
            <div class="event-title">Travel to ${dayPlan?.location || 'New Location'}</div>
            <div class="event-time">12:00 PM</div>
            <div class="event-meta">Journey to next destination</div>
          </div>
        </div>
      `;

      // Check-in to new hotel
      html += `
        <div class="timeline-event event-hotel">
          <div class="event-icon">🏨</div>
          <div class="event-content">
            <div class="event-badge">Check-in</div>
            <div class="event-title">${currentHotel}</div>
            <div class="event-time">3:00 PM</div>
            <div class="event-meta">${dayPlan?.location || ''}</div>
            <a href="${dayPlan?.accommodation?.bookingUrl || 'https://www.booking.com/hotels'}" target="_blank" class="event-booking-link">🔗 View Hotel</a>
          </div>
        </div>
      `;
    }

    // Add activities for middle days
    if (dayPlan && dayPlan.activities) {
      // Use API-provided activities
      // Filter out travel activities if hotel changed (we already showed travel above)
      const activitiesToShow = hotelChanged
        ? dayPlan.activities.filter(activity => activity.type !== 'travel')
        : dayPlan.activities;

      activitiesToShow.forEach(activity => {
        html += `
          <div class="timeline-event event-activity">
            <div class="event-icon">${getActivityEmoji(activity.type)}</div>
            <div class="event-content">
              <div class="event-badge">Activity</div>
              <div class="event-title">${activity.title || activity.name}</div>
              <div class="event-time">${activity.time || 'TBD'}</div>
              <div class="event-meta">${activity.duration || ''} • ${activity.type || 'Experience'}</div>
              ${activity.bookingUrl ? `<a href="${activity.bookingUrl}" target="_blank" class="event-booking-link">🔗 Book Activity</a>` : ''}
            </div>
          </div>
        `;
      });
    } else if (day > 1 && day < days && !hotelChanged) {
      // Use default activities
      const activityIndex = (day - 2) % (itinerary.activities?.length || 1);
      const activity = itinerary.activities?.[activityIndex] || {};

      html += `
        <div class="timeline-event event-activity">
          <div class="event-icon">${activity.image || '�'}</div>
          <div class="event-content">
            <div class="event-badge">Activity</div>
            <div class="event-title">${activity.name || 'Local Experience'}</div>
            <div class="event-time">${activity.bestTime === 'Morning' ? '9:00 AM' : '2:00 PM'}</div>
            <div class="event-meta">${activity.duration || '2 hours'} • ${activity.category || 'Experience'}</div>
            <a href="${activity.bookingUrl || 'https://www.viator.com'}" target="_blank" class="event-booking-link">🔗 Book Activity</a>
          </div>
        </div>
      `;
    }

    // Last day: Check-out + Return flight
    if (day === days) {
      // Get hotel name from current day, or fallback to previous day if not available
      const lastDayPlan = dailyPlan[day - 1];
      const prevDayPlan = day > 1 ? dailyPlan[day - 2] : null;
      const hotelName = lastDayPlan?.accommodation?.name || prevDayPlan?.accommodation?.name || itinerary.hotel?.name || 'Hotel';

      html += `
        <div class="timeline-event event-hotel">
          <div class="event-icon">🏨</div>
          <div class="event-content">
            <div class="event-badge">Check-out</div>
            <div class="event-title">${hotelName}</div>
            <div class="event-time">${itinerary.hotel?.checkOut || '11:00 AM'}</div>
            <div class="event-meta">${dayPlan?.location || ''}</div>
          </div>
        </div>
        
        <div class="timeline-event event-travel">
          <div class="event-icon">✈️</div>
          <div class="event-content">
            <div class="event-badge">Return Flight</div>
            <div class="event-title">${itinerary.flight?.to?.split('(')[0] || 'Destination'} → ${itinerary.flight?.from?.split('(')[0] || 'Home'}</div>
            <div class="event-time">6:00 PM - 11:59 PM</div>
            <a href="${itinerary.flight?.bookingUrl || 'https://www.google.com/travel/flights'}" target="_blank" class="event-booking-link">🔗 Book Return Flight</a>
          </div>
        </div>
      `;
    }

    html += `
        </div>
      </div>
    `;
  }

  return html;
}

function formatCurrency(amount, currency = 'USD') {
  const numAmount = parseFloat(amount) || 0;
  const symbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹' };
  return `${symbols[currency] || '$'}${Math.round(numAmount).toLocaleString()}`;
}

function getDefaultTripData() {
  return {
    tripName: 'My Trip',
    tripType: 'round-trip',
    startLocation: 'New York, NY (JFK)',
    destinations: ['Paris, France (CDG)'],
    startDate: '2025-06-15',
    duration: 7,
    adults: 2,
    children: 0,
    infants: 0,
    currency: 'USD',
    budget: 5000,
    travelStyle: 'comfort',
    optimizeFor: 'experience'
  };
}

const timelinePageStyles = `
  <style>
    .timeline-page {
      min-height: 100vh;
      background: var(--color-bg-primary);
    }
    
    .summary-bar {
      background: var(--color-bg-card);
      border-bottom: 1px solid var(--color-border-subtle);
      padding: var(--spacing-6) 0;
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
    }
    
    .summary-container {
      max-width: var(--max-width-2xl);
      margin: 0 auto;
      padding: 0 var(--spacing-6);
      display: grid;
      grid-template-columns: auto auto 1fr auto;
      align-items: center;
      gap: var(--spacing-2);
    }
    
    .timeline-logo {
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-1);
      border-radius: var(--radius-lg);
      background: transparent;
    }
    
    .timeline-logo:hover {
      transform: scale(1.05);
      background: rgba(255, 107, 53, 0.1);
    }
    
    .timeline-logo img {
      height: 52px;
      width: auto;
      display: block;
      mix-blend-mode: normal;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    
    .summary-info {
      /* No grid positioning needed - flows naturally */
    }
    
    .summary-info .trip-name {
      font-size: var(--font-size-2xl);
      margin-bottom: var(--spacing-2);
    }
    
    .trip-meta {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }
    
    .dot { color: var(--color-text-tertiary); }
    
    .budget-display { 
      grid-column: 3;
      justify-self: center;
      max-width: 300px;
      text-align: center;
    }
    
    .budget-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--spacing-1);
    }
    
    .budget-amount {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      background: var(--color-brand-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--spacing-2);
      text-align: left;
    }
    
    .budget-meter-container { margin-top: var(--spacing-2); }
    
    .budget-meter {
      width: 100%;
      height: 8px;
      background: #9e9e9e;
      border-radius: var(--radius-full);
      overflow: hidden;
    }
    
    .budget-meter-fill {
      height: 100%;
      background: var(--color-brand-gradient);
      transition: width var(--transition-base);
    }
    
    .budget-percentage {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      margin-top: var(--spacing-1);
    }
    
    /* Over-budget warning styles */
    .budget-meter-fill.over-budget {
      background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
    }
    
    .budget-percentage.over-budget-text {
      color: #ff4444;
      font-weight: var(--font-weight-semibold);
    }
    
    .summary-actions {
      grid-column: 4;
      justify-self: end;
      display: flex;
      gap: var(--spacing-3);
    }
    
    .timeline-container {
      max-width: var(--max-width-2xl);
      margin: 0 auto;
      padding: var(--spacing-8) var(--spacing-6);
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: var(--spacing-8);
    }
    
    .timeline-panel { min-height: 600px; }
    
    .panel-title {
      font-size: var(--font-size-2xl);
      margin-bottom: var(--spacing-6);
    }
    
    .timeline { position: relative; }
    
    .timeline-day { 
      margin-bottom: var(--spacing-8);
      position: relative;
    }
    
    .day-header {
      margin-bottom: var(--spacing-4);
      padding-left: var(--spacing-16);
      position: relative;
    }
    
    .day-header::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 50%;
      width: 12px;
      height: 12px;
      background: var(--color-brand-primary);
      border-radius: 50%;
      transform: translateY(-50%);
      box-shadow: 0 0 0 4px var(--color-bg-primary), 0 0 0 6px var(--color-brand-glow);
    }
    
    .day-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-tertiary);
      letter-spacing: 0.05em;
    }
    
    .day-events {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
      position: relative;
      padding-left: var(--spacing-16);
    }
    
    /* Vertical connecting line within each day - default */
    .day-events::before {
      content: '';
      position: absolute;
      left: 25px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--day-color, #6366f1);
      border-radius: var(--radius-full);
    }
    
    /* Different colors for each day */
    .day-color-1 { --day-color: #3b82f6; } /* Blue */
    .day-color-1 .day-header::before { background: #3b82f6; box-shadow: 0 0 0 4px var(--color-bg-primary), 0 0 12px rgba(59, 130, 246, 0.5); }
    
    .day-color-2 { --day-color: #8b5cf6; } /* Purple */
    .day-color-2 .day-header::before { background: #8b5cf6; box-shadow: 0 0 0 4px var(--color-bg-primary), 0 0 12px rgba(139, 92, 246, 0.5); }
    
    .day-color-3 { --day-color: #10b981; } /* Emerald */
    .day-color-3 .day-header::before { background: #10b981; box-shadow: 0 0 0 4px var(--color-bg-primary), 0 0 12px rgba(16, 185, 129, 0.5); }
    
    .day-color-4 { --day-color: #f59e0b; } /* Amber */
    .day-color-4 .day-header::before { background: #f59e0b; box-shadow: 0 0 0 4px var(--color-bg-primary), 0 0 12px rgba(245, 158, 11, 0.5); }
    
    .day-color-5 { --day-color: #ec4899; } /* Pink */
    .day-color-5 .day-header::before { background: #ec4899; box-shadow: 0 0 0 4px var(--color-bg-primary), 0 0 12px rgba(236, 72, 153, 0.5); }
    
    .day-color-6 { --day-color: #14b8a6; } /* Teal */
    .day-color-6 .day-header::before { background: #14b8a6; box-shadow: 0 0 0 4px var(--color-bg-primary), 0 0 12px rgba(20, 184, 166, 0.5); }
    
    .day-color-7 { --day-color: #f97316; } /* Orange */
    .day-color-7 .day-header::before { background: #f97316; box-shadow: 0 0 0 4px var(--color-bg-primary), 0 0 12px rgba(249, 115, 22, 0.5); }
    
    .timeline-event {
      position: relative;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--spacing-4);
      cursor: pointer;
      transition: all var(--transition-base);
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-4);
    }
    
    /* Dots and connectors removed per user request */
    
    .timeline-event:hover {
      border-color: var(--color-brand-primary);
      transform: translateX(4px);
      box-shadow: var(--shadow-md);
    }
    
    .event-travel::before { background: #3b82f6; box-shadow: 0 0 8px rgba(59, 130, 246, 0.5); }
    .event-hotel::before { background: #8b5cf6; box-shadow: 0 0 8px rgba(139, 92, 246, 0.5); }
    .event-activity::before { background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); }
    
    .event-icon { font-size: var(--font-size-2xl); flex-shrink: 0; }
    .event-content { flex: 1; }
    
    .event-badge {
      display: inline-block;
      font-size: var(--font-size-xs);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      background: var(--glass-bg);
      margin-bottom: var(--spacing-2);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .event-title {
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-1);
    }
    
    .event-time {
      color: var(--color-brand-primary);
      font-size: var(--font-size-sm);
      margin-bottom: var(--spacing-1);
    }
    
    .event-meta {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
    }
    
    .event-booking-link {
      display: inline-block;
      margin-top: var(--spacing-2);
      font-size: var(--font-size-xs);
      color: var(--color-brand-primary);
      text-decoration: none;
      padding: 4px 8px;
      background: rgba(255,255,255,0.1);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }
    
    .event-booking-link:hover {
      background: var(--color-brand-primary);
      color: white;
    }
    
    .sidebar-panel {
      position: sticky;
      top: 120px;
      height: fit-content;
      max-height: calc(100vh - 160px);
      overflow-y: auto;
    }
    
    .panel-section { margin-bottom: var(--spacing-8); }
    
    .activity-discover-section {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-xl);
      padding: var(--spacing-5);
      box-shadow: var(--shadow-sm);
    }
    
    .activity-discover-section .section-title {
      margin-bottom: var(--spacing-5);
      padding-bottom: var(--spacing-3);
      border-bottom: 1px solid var(--color-border-subtle);
    }
    
    .section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-4);
    }
    
    .booking-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--spacing-4);
      margin-bottom: var(--spacing-4);
      transition: all var(--transition-base);
    }
    
    .booking-card:hover {
      border-color: var(--color-brand-primary);
      box-shadow: var(--shadow-md);
    }
    
    .booking-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-3);
    }
    
    .booking-icon { font-size: var(--font-size-xl); }
    
    .booking-type {
      flex: 1;
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .booking-price {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-brand-primary);
    }
    
    .booking-details { margin-bottom: var(--spacing-3); }
    
    .booking-title {
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-1);
    }
    
    .booking-subtitle {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-1);
    }
    
    .booking-meta {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
    }
    
    .booking-dates {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      margin-top: var(--spacing-2);
      padding-top: var(--spacing-2);
      border-top: 1px solid var(--color-border-subtle);
    }
    
    .booking-actions {
      display: flex;
      gap: var(--spacing-2);
    }
    
    .booking-actions .btn,
    .booking-actions a.btn {
      flex: 1;
      text-align: center;
      text-decoration: none;
    }
    
    .price-breakdown {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    
    .breakdown-header {
      padding: var(--spacing-4);
      cursor: pointer;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: background var(--transition-fast);
    }
    
    .breakdown-header:hover { background: var(--glass-bg); }
    
    .breakdown-header::marker,
    .breakdown-header::-webkit-details-marker { display: none; }
    
    .breakdown-title { font-weight: var(--font-weight-semibold); }
    
    .breakdown-arrow { transition: transform var(--transition-base); }
    
    details[open] .breakdown-arrow { transform: rotate(180deg); }
    
    .breakdown-content { padding: 0 var(--spacing-4) var(--spacing-4); }
    
    .breakdown-item {
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-2) 0;
      font-size: var(--font-size-sm);
    }
    
    .breakdown-price { font-weight: var(--font-weight-semibold); }
    
    .breakdown-separator {
      border-top: 1px solid var(--color-border-subtle);
      margin: var(--spacing-2) 0;
    }
    
    .breakdown-total {
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-base);
      color: #ff6b35;
    }
    
    /* Activity Search & Recommendations */
    .activity-search-box {
      position: relative;
      margin-bottom: var(--spacing-4);
    }
    
    .activity-search-input {
      width: 100%;
      padding: var(--spacing-3) var(--spacing-4);
      padding-right: 48px;
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      background: var(--color-bg-elevated);
      color: var(--color-text-primary);
      font-size: var(--font-size-sm);
      transition: all var(--transition-fast);
    }
    
    .activity-search-input:focus {
      outline: none;
      border-color: var(--color-brand-primary);
      box-shadow: 0 0 0 3px var(--color-brand-glow);
    }
    
    .activity-search-input::placeholder {
      color: var(--color-text-tertiary);
    }
    
    .search-icon {
      position: absolute;
      right: var(--spacing-4);
      top: 50%;
      transform: translateY(-50%);
      font-size: var(--font-size-lg);
    }
    
    .activity-categories {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-4);
    }
    
    .category-pill {
      padding: var(--spacing-2) var(--spacing-3);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-full);
      background: transparent;
      color: var(--color-text-secondary);
      font-size: var(--font-size-xs);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
    }
    
    .category-pill:hover {
      border-color: var(--color-brand-primary);
      color: var(--color-brand-primary);
    }
    
    .category-pill.active {
      background: var(--color-brand-primary);
      border-color: var(--color-brand-primary);
      color: white;
    }
    
    .activity-recommendations {
      max-height: 400px;
      overflow-y: auto;
      padding-right: var(--spacing-2);
    }
    
    .activity-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3);
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-3);
      transition: all var(--transition-fast);
    }
    
    .activity-card:hover {
      border-color: var(--color-brand-primary);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    .activity-card.hidden {
      display: none;
    }
    
    .activity-card-icon {
      font-size: var(--font-size-2xl);
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--glass-bg);
      border-radius: var(--radius-md);
      flex-shrink: 0;
    }
    
    .activity-card-content {
      flex: 1;
      min-width: 0;
    }
    
    .activity-card-title {
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      margin-bottom: var(--spacing-1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .activity-card-meta {
      display: flex;
      gap: var(--spacing-3);
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      margin-bottom: var(--spacing-1);
    }
    
    .activity-card-price {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-brand-primary);
    }
    
    .activity-card-actions {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }
    
    .activity-book-link {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      text-decoration: none;
      text-align: center;
      transition: color var(--transition-fast);
    }
    
    .activity-book-link:hover {
      color: var(--color-brand-primary);
    }
    
    @media (max-width: 1024px) {
      .timeline-container {
        grid-template-columns: 1fr;
      }
      .sidebar-panel {
        position: static;
        max-height: none;
      }
    }
`;


// PDF Export Function - MUST be outside template string to execute
// This is REAL JavaScript, not injected HTML
window.exportTimelinePDF = async function () {
  console.log("EXPORT PDF STARTED");

  const container = document.getElementById("timeline-export");
  if (!container) {
    alert("Timeline not found");
    return;
  }


  // Get trip data from sessionStorage for cover page (already declared below)

  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff"
  });

  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Retrieve trip data for cover page
  const coverTripDataStr = sessionStorage.getItem('tripData');
  let tripData = {};

  if (coverTripDataStr) {
    try {
      tripData = JSON.parse(coverTripDataStr);
    } catch (e) {
      console.error('Error parsing trip data:', e);
    }
  }

  // ===== PREMIUM COVER PAGE - BLACK & ORANGE THEME =====

  // Clean white background
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

  // Bold orange accent top border
  pdf.setFillColor(255, 107, 53);
  pdf.rect(0, 0, pdfWidth, 4, 'F');

  // Load transparent logo
  const logo = new Image();
  logo.src = '/logo-pdf.png';

  await new Promise((resolve) => {
    logo.onload = () => {
      const logoWidth = 120;
      const logoHeight = 60;
      const logoX = (pdfWidth - logoWidth) / 2;
      pdf.addImage(logo, 'PNG', logoX, 20, logoWidth, logoHeight);
      resolve();
    };
    logo.onerror = () => {
      console.warn('Logo failed to load');
      resolve();
    };
  });

  // Orange decorative line (moved down to avoid logo overlap)
  pdf.setDrawColor(255, 107, 53);
  pdf.setLineWidth(0.8);
  pdf.line(pdfWidth / 2 - 35, 85, pdfWidth / 2 + 35, 85);

  // Trip name - Bold black
  pdf.setTextColor(20, 20, 20);
  pdf.setFontSize(34);
  pdf.setFont(undefined, 'bold');
  const tripName = tripData.tripName || 'My Travel Itinerary';
  pdf.text(tripName, pdfWidth / 2, 112, { align: 'center', maxWidth: 160 });

  // Orange subtitle
  pdf.setTextColor(255, 107, 53);
  pdf.setFontSize(13);
  pdf.setFont(undefined, 'italic');
  pdf.text('Curated Adventures', pdfWidth / 2, 125, { align: 'center' });

  // Orange circles
  pdf.setFillColor(255, 107, 53);
  pdf.circle(pdfWidth / 2 - 22, 138, 1.2, 'F');
  pdf.circle(pdfWidth / 2, 138, 1.2, 'F');
  pdf.circle(pdfWidth / 2 + 22, 138, 1.2, 'F');

  // Orange bordered box
  const boxY = 153;
  pdf.setDrawColor(255, 107, 53);
  pdf.setLineWidth(1.5);
  pdf.roundedRect(25, boxY, pdfWidth - 50, 68, 4, 4, 'S');

  // Dates
  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');
  pdf.text('JOURNEY DATES', pdfWidth / 2, boxY + 13, { align: 'center' });

  const startDate = tripData.startDate || 'N/A';
  const duration = tripData.duration || 7;
  let endDateStr = 'N/A';
  if (startDate && startDate !== 'N/A') {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + parseInt(duration) - 1);
    endDateStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  const startDateFormatted = startDate !== 'N/A' ? new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

  pdf.setFontSize(15);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(20, 20, 20);
  pdf.text(`${startDateFormatted} - ${endDateStr}`, pdfWidth / 2, boxY + 26, { align: 'center' });

  // Divider
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.5);
  pdf.line(40, boxY + 35, pdfWidth - 40, boxY + 35);

  // Travelers
  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');
  pdf.text('TRAVELERS', pdfWidth / 2, boxY + 47, { align: 'center' });

  const travelers = (parseInt(tripData.adults) || 0) + (parseInt(tripData.children) || 0) + (parseInt(tripData.infants) || 0);
  pdf.setFontSize(15);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(20, 20, 20);
  pdf.text(`${travelers} Traveler${travelers !== 1 ? 's' : ''}`, pdfWidth / 2, boxY + 60, { align: 'center' });

  // Dark grey cost box
  const costBoxY = 236;
  pdf.setFillColor(60, 60, 60);
  pdf.roundedRect(35, costBoxY, pdfWidth - 70, 32, 4, 4, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'bold');
  pdf.text('ESTIMATED TOTAL COST (PER PERSON)', pdfWidth / 2, costBoxY + 12, { align: 'center' });

  const totalCost = tripData.costBreakdown?.total || 0;
  const currency = tripData.currency || 'INR';
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text(`${currency} ${totalCost.toLocaleString()}`, pdfWidth / 2, costBoxY + 25, { align: 'center' });

  // Footer
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'italic');
  pdf.text('Your personalized journey, thoughtfully curated', pdfWidth / 2, 275, { align: 'center' });

  pdf.setFontSize(8);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(140, 140, 140);
  pdf.text(`Generated on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, pdfWidth / 2, 285, { align: 'center' });

  // ===== ITINERARY PAGES =====
  pdf.addPage();

  // Calculate proper dimensions for itinerary
  const canvasAspectRatio = canvas.height / canvas.width;
  let imgWidth = pdfWidth;
  let imgHeight = pdfWidth * canvasAspectRatio;

  let heightLeft = imgHeight;
  let position = 0;

  // Add first itinerary page
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Add additional pages if content overflows
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  // Get trip name for filename
  const tripDataStr = sessionStorage.getItem('tripData');
  let filename = 'TrailPlan-Itinerary.pdf';

  if (tripDataStr) {
    try {
      const tripData = JSON.parse(tripDataStr);
      const tripName = tripData.tripName || tripData.destination || 'Itinerary';
      // Sanitize filename (remove special characters)
      const sanitized = tripName.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-');
      filename = `${sanitized}.pdf`;
    } catch (e) {
      console.error('Error parsing trip data for filename:', e);
    }
  }

  pdf.save(filename);
  console.log("✅ PDF downloaded successfully");
};
