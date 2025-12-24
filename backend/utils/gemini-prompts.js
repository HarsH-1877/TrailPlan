/**
 * Gemini Prompt Template for Optimized Itinerary Generation
 * Optimized for minimal token usage while maximizing output quality
 */

function buildOptimizedItineraryPrompt(tripData, flightEstimate) {
  const {
    tripName,
    startLocation,
    destinations,
    startDate,
    duration,
    adults,
    children,
    infants,
    budget,
    currency,
    tripType
  } = tripData;

  const totalTravelers = adults + (children || 0) + (infants || 0);

  return `Create ${duration}-day itinerary for ${Array.isArray(destinations) ? destinations.join(', ') : destinations}. RETURN COMPACT JSON ONLY.

TRIP: ${duration} days | ${totalTravelers} travelers | Budget: ${currency} ${budget}

BUDGET RULES (CRITICAL - READ CAREFULLY):
- Target spending: 85-95% of ${currency} ${budget} (leave safety margin)
- NEVER exceed budget unless it's genuinely impossible (e.g., ${currency} 10,000 for international trip)
- Choose mid-range hotels and activities, not luxury options
- Be realistic with prices - verify they match typical ${currency} costs
- If estimated total > budget, reduce accommodation quality or activity count
- Example: ${currency} 100,000 for Delhi→Goa 7 days is VERY reasonable - should use ~₹85,000-95,000 MAX

HOTEL SELECTION (CRITICAL):
- Use MINIMUM hotels needed based on geography
- For large countries/multi-city trips: MUST use different hotels per city
- Each hotel should appear in "accommodation" field ONLY on days it's used
- First day of hotel: include full details with check-in
- Subsequent days at same hotel: repeat accommodation object
- Last day of hotel: include full details with check-out implication

OTHER RULES:
- Visit 2-3 cities max (optimize route)
- 2 activities per day (keep descriptions SHORT)
- Real hotel names + booking URLs
- Stay in budget

JSON (BE CONCISE):
{
  "tripSummary": {
    "title": "string",
    "optimizedRoute": ["City1", "City2"],
    "totalEstimatedCost": number,
    "costBreakdown": {"flights": number, "hotels": number, "activities": number, "meals": number}
  },
  "dailyItinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "location": "City",
      "accommodation": {
        "name": "Hotel Name",
        "pricePerNight": number,
        "totalNights": number,
        "totalPrice": number,
        "rating": number,
        "bookingUrl": "https://..."
      },
      "activities": [
        {
          "time": "HH:MM",
          "title": "Activity (SHORT)",
          "type": "sightseeing|food|culture|adventure|nature|travel",
          "duration": "Xh",
          "estimatedCost": number,
          "bookingUrl": "string|null"
        }
      ],
      "dailyBudget": {"accommodation": number, "activities": number, "meals": number, "total": number}
    }
  ],
  "budgetSummary": {
    "totalBudget": ${budget},
    "estimatedSpend": number,
    "breakdown": {"accommodation": number, "activities": number, "meals": number},
    "remainingBudget": number
  }
}

CRITICAL: Keep activity titles SHORT. Real prices in ${currency}. NO flight costs. MUST use different hotels when traveling between distant cities (e.g., Tokyo→Kyoto→Osaka needs 2-3 hotels, but Paris 3-day trip needs only 1). BUDGET COMPLIANCE IS MANDATORY - aim for 85-95% of ${currency} ${budget}, only exceed if physically impossible.`;
}

module.exports = {
  buildOptimizedItineraryPrompt
};

