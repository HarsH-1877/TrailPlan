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

TRIP: ${duration} days | ${totalTravelers} travelers | STRICT Budget: ${currency} ${budget}

BUDGET FEASIBILITY ANALYSIS (DO THIS FIRST):
Before planning, determine if budget is realistic or impossible:
1. Calculate MINIMUM VIABLE COST:
   - Assume cheapest budget accommodation: ${currency === 'INR' ? '₹2,000/night' : '$50/night'} × ${duration} nights × ${Math.ceil(totalTravelers / 2)} rooms
   - Assume minimal activities: ${currency === 'INR' ? '₹500' : '$10'} per person per day
   - Assume basic meals: ${currency === 'INR' ? '₹500' : '$15'} per person per day
   - Add any intercity transport costs
2. Compare minimum viable cost to ${currency} ${budget}
3. Decision:
   - If minimum viable cost < budget: STAY WITHIN BUDGET by choosing affordable options
   - If minimum viable cost > budget (e.g., Mumbai→Switzerland 7 days for ₹30,000): You may exceed budget BUT note this in budgetSummary.remainingBudget as negative

EXAMPLES OF IMPOSSIBLE BUDGETS (may exceed):
- International long-haul trip (India→Europe/USA) for < ${currency === 'INR' ? '₹50,000' : '$1,000'}
- Luxury destination (Switzerland, Dubai) for < ${currency === 'INR' ? '₹70,000' : '$1,500'} for 7+ days
- Large group (5+ people) on extremely tight budget

EXAMPLES OF PRACTICAL BUDGETS (MUST stay within):
- Domestic India trips with ₹50,000+ for 7 days
- Regional Asia trips (India→Thailand/Bali) with ₹80,000+
- Any trip where basic accommodation + food + activities fits in budget

BUDGET RULES (CRITICAL - STRICTLY ENFORCE):
1. ABSOLUTE MAXIMUM: ${currency} ${budget} - DO NOT EXCEED under any circumstances
2. Target spending: 75-85% of ${currency} ${budget} (leave 15-25% safety margin)
3. Calculate costs BEFORE selecting hotels/activities - if over budget, choose cheaper options
4. BUDGET-CONSCIOUS PRIORITY ORDER:
   a. First allocate for essential transport/travel between cities
   b. Then find AFFORDABLE hotels within remaining budget
   c. Finally add activities that fit remaining budget
5. If math doesn't work: REDUCE hotel quality, star rating, or amenities - NOT exceed budget

HOTEL PRICING (STRICT REQUIREMENTS):
- Research REAL booking.com prices for the destination cities
- For ${currency} currency, typical budget hotel: ${currency === 'INR' ? '₹2,000-4,000/night' : '$50-100/night'}
- For ${currency} currency, typical mid-range: ${currency === 'INR' ? '₹4,000-7,000/night' : '$100-150/night'}
- ALWAYS choose hotels on the LOWER end of price ranges
- Verify: (hotel cost per night × nights × rooms needed for ${totalTravelers} pax) fits in budget
- For groups: may need multiple rooms = multiply hotel cost accordingly
- Example: Family of 4 in ₹3,000/night hotel = ₹6,000/night total (2 rooms)

HOTEL SELECTION (CRITICAL):
- Use MINIMUM hotels needed based on geography
- Select 3-star or budget hotels, NOT 4-5 star luxury properties
- Prioritize VALUE over luxury - guest houses, budget chains, affordable options
- For large countries/multi-city trips: MUST use different hotels per city
- Each hotel should appear in "accommodation" field ONLY on days it's used
- pricePerNight should reflect TOTAL cost for all travelers (all rooms combined)
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

VERIFICATION CHECKLIST (DO THIS BEFORE RETURNING JSON):
1. Budget Feasibility Re-check:
   - Did I calculate minimum viable cost vs user budget?
   - If I exceeded budget: Was it genuinely impossible or did I just choose expensive options?
   - For practical budgets: Did I aggressively find cheapest viable options?
2. Calculate total cost: Add ALL accommodation + activities + meals
3. Compare: Is total ≤ ${currency} ${budget}? If NO and budget was PRACTICAL, reduce hotel quality or remove activities
4. Double-check hotel prices: Are they realistic for ${currency} in these cities? Are they budget-friendly?
5. Room calculation: Did you account for ${totalTravelers} travelers (may need multiple rooms)?
6. Final check: For PRACTICAL budgets, estimatedSpend MUST be ≤ ${budget}. For IMPOSSIBLE budgets, note deficit in remainingBudget as negative.

CRITICAL: Keep activity titles SHORT. Real prices in ${currency}. NO flight costs in itinerary. MUST use different hotels when traveling between distant cities. BUDGET COMPLIANCE IS ABSOLUTELY MANDATORY for practical budgets. Only exceed for GENUINELY IMPOSSIBLE scenarios (e.g., ₹30k Mumbai→Switzerland). For all normal trips, target 75-85% of ${currency} ${budget} by finding CHEAPER HOTELS and reducing activities. NEVER exceed budget just because you selected expensive options.`;
}

module.exports = {
  buildOptimizedItineraryPrompt
};

