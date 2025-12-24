/**
 * Build master prompt for Gemini AI to optimize itinerary
 */
function buildMasterPrompt(tripData, bookingData) {
    const {
        destinations,
        startDate,
        duration,
        adults = 2,
        children = 0,
        budget,
        currency = 'USD',
        preferences = {}
    } = tripData;

    const { flights, hotels } = bookingData;

    const prompt = `You are an expert travel planner and route optimizer. Create a highly optimized ${duration}-day itinerary.

**USER PREFERENCES:**
- Destinations: ${destinations.join(', ')}
- Start Date: ${startDate}
- Duration: ${duration} days
- Travelers: ${adults} adults${children > 0 ? `, ${children} children` : ''}
- Budget: ${currency} ${budget} per person
- Interests: ${preferences.interests?.join(', ') || 'general sightseeing'}
- Pace: ${preferences.pace || 'moderate'}
- Adventure Level: ${preferences.adventureLevel || 'medium'}

**AVAILABLE FLIGHTS:**
${JSON.stringify(flights, null, 2)}

**AVAILABLE HOTELS BY CITY:**
${JSON.stringify(hotels, null, 2)}

**OPTIMIZATION REQUIREMENTS:**

1. **Geographic Clustering & Routing:**
   - Analyze the geographic locations of destinations
   - Create an optimal route that minimizes backtracking
   - Group nearby cities together
   - Consider travel time between cities
   - Suggest best transportation method (flight, train, bus, car)

2. **Hotel Strategy:**
   - MINIMIZE hotel changes (ideally 1 hotel per city cluster)
   - Allocate nights strategically based on city size and attractions
   - Select hotels that are:
     * Centrally located for easy access to attractions
     * Within the daily budget (~30% of total daily budget)
     * Highly rated and with good amenities
   - Provide hotel name, address, price per night, total price, and key amenities

3. **Activity Selection & Scheduling:**
   - Research and include TOP attractions for each city
   - Match activities to user interests: ${preferences.interests?.join(', ') || 'general'}
   - Create realistic daily schedules:
     * Maximum 8 hours of active sightseeing per day
     * Include breakfast, lunch, dinner breaks
     * Add rest time between activities
     * Consider opening hours and travel time between attractions
   - Respect the "${preferences.pace || 'moderate'}" pace:
     * Relaxed: 2-3 activities per day
     * Moderate: 3-4 activities per day  
     * Fast: 4-5 activities per day
   - Include variety: mix of culture, nature, food, adventure

4. **Cost Optimization:**
   - Total cost MUST be ≤ ${currency} ${budget} per person
   - Select best value flights from available options
   - Select best value hotels that meet criteria
   - Estimate realistic activity costs (entry fees, tickets, meals)
   - Include a buffer for unexpected expenses (~10% of budget)

5. **Practical Considerations:**
   - Account for jet lag on arrival day (lighter schedule)
   - Include airport transfer time
   - Suggest best times to visit each attraction (avoid crowds)
   - Note any special events or festivals during travel dates
   - Include local transportation tips

**OUTPUT FORMAT:**
Return ONLY valid JSON with this exact structure:

{
  "tripSummary": {
    "title": "7-Day Norway Adventure",
    "optimizedRoute": ["Oslo", "Bergen", "Tromsø"],
    "totalCost": 1850,
    "costBreakdown": {
      "flights": 930,
      "hotels": 680,
      "activities": 200,
      "meals": 40
    },
    "travelers": {
      "adults": 2,
      "children": 0
    }
  },
  "selectedFlights": {
    "outbound": {
      "from": "JFK",
      "to": "OSL",
      "date": "2025-06-15",
      "airline": "Norwegian Air",
      "flightNumber": "DY7012",
      "departureTime": "18:00",
      "arrivalTime": "08:30+1",
      "duration": "8h 30m",
      "price": 450,
      "class": "Economy"
    },
    "return": {
      "from": "TOS",
      "to": "JFK",
      "date": "2025-06-22",
      "airline": "Norwegian Air",
      "flightNumber": "DY7013",
      "departureTime": "10:00",
      "arrivalTime": "14:30",
      "duration": "8h 45m",
      "price": 480,
      "class": "Economy"
    }
  },
  "selectedHotels": [
    {
      "city": "Oslo",
      "name": "Thon Hotel Opera",
      "address": "Dronning Eufemias gate 4, 0191 Oslo",
      "checkIn": "2025-06-15",
      "checkOut": "2025-06-17",
      "nights": 2,
      "pricePerNight": 120,
      "totalPrice": 240,
      "rating": 4.2,
      "amenities": ["WiFi", "Breakfast Included", "City View", "Gym"],
      "location": {
        "lat": 59.9139,
        "lng": 10.7522
      }
    }
  ],
  "dailyItinerary": [
    {
      "day": 1,
      "date": "2025-06-15",
      "city": "Oslo",
      "hotel": "Thon Hotel Opera",
      "theme": "Arrival & City Orientation",
      "activities": [
        {
          "time": "08:30",
          "type": "arrival",
          "title": "Arrive at Oslo Airport (OSL)",
          "duration": 0,
          "cost": 0,
          "description": "Clear customs and collect baggage",
          "tips": "Airport Express Train to city center takes 20 minutes"
        },
        {
          "time": "10:00",
          "type": "transport",
          "title": "Airport Express Train to Oslo Central",
          "duration": 0.5,
          "cost": 15,
          "description": "Fast train to city center"
        },
        {
          "time": "11:00",
          "type": "hotel",
          "title": "Check-in at Thon Hotel Opera",
          "duration": 0.5,
          "cost": 0,
          "description": "Drop bags and refresh"
        },
        {
          "time": "12:00",
          "type": "food",
          "title": "Lunch at Mathallen Food Hall",
          "duration": 1,
          "cost": 20,
          "description": "Try Norwegian specialties at indoor food market"
        },
        {
          "time": "14:00",
          "type": "sightseeing",
          "title": "Vigeland Sculpture Park",
          "duration": 2,
          "cost": 0,
          "description": "World's largest sculpture park by a single artist, featuring 200+ bronze, granite, and iron sculptures",
          "tips": "Free entry, great for photos, very walkable"
        },
        {
          "time": "17:00",
          "type": "culture",
          "title": "Oslo Opera House",
          "duration": 1.5,
          "cost": 0,
          "description": "Walk on the iconic sloped roof for sunset views over the fjord",
          "tips": "Free to walk on roof, optional guided tour available"
        },
        {
          "time": "19:00",
          "type": "food",
          "title": "Dinner at Aker Brygge Waterfront",
          "duration": 1.5,
          "cost": 35,
          "description": "Seafood restaurants with harbor views"
        }
      ],
      "dailyCost": 70,
      "notes": "Light first day to recover from jet lag. Focus on outdoor, easy activities."
    }
  ],
  "travelTips": [
    "Norway is expensive - save money by grocery shopping for some meals",
    "Oslo Pass gives free entry to 30+ attractions and public transport",
    "Book train tickets Oslo-Bergen in advance for best prices",
    "Northern lights best seen September-March (not during June trip)"
  ],
  "packingList": [
    "Layered clothing (weather can be unpredictable)",
    "Rain jacket",
    "Comfortable walking shoes",
    "Power adapter (Type C/F plugs)",
    "Reusable water bottle"
  ]
}

**CRITICAL RULES:**
- Return ONLY the JSON object, no additional text
- Ensure all costs add up correctly
- Stay within the ${currency} ${budget} per person budget
- Include realistic timing and durations
- Make sure daily schedules are achievable
- Use actual attraction names and locations
- Be specific with hotel and flight details`;

    return prompt;
}

module.exports = {
    buildMasterPrompt
};
