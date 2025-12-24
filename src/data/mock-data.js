// Mock data for flights, hotels, activities

export const mockFlights = [
    {
        id: 'FL001',
        from: 'New York, NY (JFK)',
        to: 'Paris, France (CDG)',
        airline: 'Air France',
        flightNumber: 'AF007',
        departTime: '10:00 AM',
        arriveTime: '10:00 PM',
        duration: '8h 00m',
        stops: 0,
        price: 650,
        class: 'Economy',
        logo: '✈️',
        rating: 4.5,
        cancellationPolicy: 'Free cancellation within 24 hours',
        amenities: ['WiFi', 'Meals', 'Entertainment']
    },
    {
        id: 'FL002',
        from: 'New York, NY (JFK)',
        to: 'Paris, France (CDG)',
        airline: 'Delta',
        flightNumber: 'DL123',
        departTime: '6:30 PM',
        arriveTime: '8:30 AM+1',
        duration: '7h 00m',
        stops: 0,
        price: 720,
        class: 'Economy',
        logo: '✈️',
        rating: 4.3,
        cancellationPolicy: 'Refundable with fee',
        amenities: ['WiFi', 'Meals', 'Priority Boarding']
    },
    {
        id: 'FL003',
        from: 'New York, NY (JFK)',
        to: 'Paris, France (CDG)',
        airline: 'United',
        flightNumber: 'UA890',
        departTime: '5:15 PM',
        arriveTime: '7:15 AM+1',
        duration: '7h 00m',
        stops: 0,
        price: 580,
        class: 'Economy',
        logo: '✈️',
        rating: 4.1,
        cancellationPolicy: 'Non-refundable',
        amenities: ['Meals', 'Entertainment']
    }
];

export const mockHotels = [
    {
        id: 'HT001',
        name: 'Hotel Bradford Elysées',
        location: 'Paris, France',
        address: '10 Rue St. Philippe du Roule, 75008 Paris',
        rating: 4.5,
        stars: 4,
        pricePerNight: 180,
        totalNights: 6,
        totalPrice: 1080,
        image: '🏨',
        amenities: ['Free WiFi', 'Breakfast Included', 'Air Conditioning', 'Concierge', '24/7 Front Desk'],
        checkIn: '3:00 PM',
        checkOut: '12:00 PM',
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
        roomType: 'Deluxe Double Room',
        description: 'Elegant hotel near the Champs-Élysées with classic Parisian charm',
        reviews: 328,
        overallRating: 4.5
    },
    {
        id: 'HT002',
        name: 'Mercure Paris Centre Tour Eiffel',
        location: 'Paris, France',
        address: '20 Rue Jean Rey, 75015 Paris',
        rating: 4.2,
        stars: 4,
        pricePerNight: 165,
        totalNights: 6,
        totalPrice: 990,
        image: '🏨',
        amenities: ['Free WiFi', 'Breakfast', 'Gym', 'Bar', 'Room Service'],
        checkIn: '2:00 PM',
        checkOut: '12:00 PM',
        cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
        roomType: 'Standard Double Room',
        description: 'Modern hotel with stunning Eiffel Tower views',
        reviews: 512,
        overallRating: 4.2
    },
    {
        id: 'HT003',
        name: 'Novotel Paris Les Halles',
        location: 'Paris, France',
        address: '8 Place Marguerite de Navarre, 75001 Paris',
        rating: 4.0,
        stars: 4,
        pricePerNight: 145,
        totalNights: 6,
        totalPrice: 870,
        image: '🏨',
        amenities: ['Free WiFi', 'Pool', 'Restaurant', 'Bar'],
        checkIn: '3:00 PM',
        checkOut: '11:00 AM',
        cancellationPolicy: 'Non-refundable',
        roomType: 'Standard Room',
        description: 'Central location near historic Les Halles district',
        reviews: 421,
        overallRating: 4.0
    }
];

export const mockActivities = [
    {
        id: 'ACT001',
        name: 'Eiffel Tower Summit Tour',
        category: 'Landmarks',
        location: 'Paris, France',
        duration: '2 hours',
        price: 65,
        rating: 4.8,
        reviews: 12453,
        image: '🗼',
        description: 'Skip-the-line access to the summit of the Eiffel Tower with guided tour',
        included: ['Skip-the-line tickets', 'Summit access', 'Mobile voucher'],
        meetingPoint: 'Eiffel Tower - South Security Entrance',
        openingHours: '9:00 AM - 11:00 PM',
        bestTime: 'Morning',
        provider: 'GetYourGuide'
    },
    {
        id: 'ACT002',
        name: 'Louvre Museum Skip-the-Line',
        category: 'Museums',
        location: 'Paris, France',
        duration: '3 hours',
        price: 52,
        rating: 4.7,
        reviews: 15821,
        image: '🖼️',
        description: 'Reserved access to the world\'s largest art museum including Mona Lisa viewing',
        included: ['Skip-the-line entry', 'Audio guide', 'Map'],
        meetingPoint: 'Louvre Pyramid Entrance',
        openingHours: '9:00 AM - 6:00 PM',
        bestTime: 'Early morning or late afternoon',
        provider: 'Viator'
    },
    {
        id: 'ACT003',
        name: 'Seine River Sunset Cruise',
        category: 'Cruises',
        location: 'Paris, France',
        duration: '1.5 hours',
        price: 45,
        rating: 4.6,
        reviews: 8932,
        image: '⛵',
        description: 'Romantic evening cruise along the Seine with champagne and music',
        included: ['River cruise', 'Champagne', 'Audio commentary'],
        meetingPoint: 'Port de la Bourdonnais',
        openingHours: '6:00 PM - 10:00 PM',
        bestTime: 'Sunset',
        provider: 'Bateaux Parisiens'
    },
    {
        id: 'ACT004',
        name: 'Versailles Palace & Gardens',
        category: 'Castles',
        location: 'Versailles, France',
        duration: '5 hours',
        price: 85,
        rating: 4.9,
        reviews: 9245,
        image: '👑',
        description: 'Full guided tour of the Palace of Versailles and its magnificent gardens',
        included: ['Round-trip transport', 'Skip-the-line access', 'Guided tour', 'Garden access'],
        meetingPoint: 'Central Paris Pickup',
        openingHours: '9:00 AM - 6:30 PM',
        bestTime: 'Full day',
        provider: 'City Wonders'
    },
    {
        id: 'ACT005',
        name: 'Montmartre & Sacré-Cœur Walking Tour',
        category: 'Walking Tours',
        location: 'Paris, France',
        duration: '2.5 hours',
        price: 35,
        rating: 4.7,
        reviews: 3421,
        image: '🚶',
        description: 'Explore the artistic neighborhood of Montmartre with a local guide',
        included: ['Expert guide', 'Small group', 'Sacré-Cœur visit'],
        meetingPoint: 'Abbesses Metro Station',
        openingHours: '10:00 AM - 6:00 PM',
        bestTime: 'Morning or afternoon',
        provider: 'Paris Walks'
    },
    {
        id: 'ACT006',
        name: 'French Cuisine Cooking Class',
        category: 'Food & Dining',
        location: 'Paris, France',
        duration: '3 hours',
        price: 95,
        rating: 4.8,
        reviews: 1892,
        image: '👨‍🍳',
        description: 'Learn to cook classic French dishes with a professional chef',
        included: ['Ingredients', 'Recipes', 'Lunch/Dinner', 'Wine'],
        meetingPoint: 'Le Foodist Cooking School, 59 Rue du Cardinal Lemoine',
        openingHours: '11:00 AM - 2:00 PM, 6:00 PM - 9:00 PM',
        bestTime: 'Lunch or dinner time',
        provider: 'Le Foodist'
    }
];

export const transfers = [
    {
        id: 'TR001',
        type: 'Airport Transfer',
        from: 'CDG Airport',
        to: 'Hotel Bradford Elysées',
        price: 55,
        duration: '45 minutes',
        mode: 'Private Car',
        provider: 'Uber'
    },
    {
        id: 'TR002',
        type: 'City Transfer',
        from: 'Paris',
        to: 'Versailles',
        price: 35,
        duration: '50 minutes',
        mode: 'Train',
        provider: 'SNCF'
    }
];

// Mock pricing data
export const pricingEstimates = {
    foodPerDay: {
        budget: 25,
        comfort: 50,
        luxury: 100
    },
    contingencyPercent: 0.08, // 8% buffer
    taxesAndFees: 0.05 // 5% taxes
};

// Helper function to generate mock itinerary based on form data
export function generateMockItinerary(formData) {
    const days = formData.duration || 7;
    const travelStyle = formData.travelStyle || 'comfort';
    const budget = formData.budget || 5000;

    // Select flight (cheapest for budget, middle for comfort, most expensive for luxury)
    let selectedFlight = mockFlights[1]; // default comfort
    if (travelStyle === 'budget') {
        selectedFlight = mockFlights[2];
    } else if (travelStyle === 'luxury') {
        selectedFlight = mockFlights[1];
    }

    // Select hotel
    let selectedHotel = mockHotels[0]; // default comfort
    if (travelStyle === 'budget') {
        selectedHotel = mockHotels[2];
    } else if (travelStyle === 'luxury') {
        selectedHotel = mockHotels[0];
    }
    selectedHotel = { ...selectedHotel, totalNights: days - 1, totalPrice: selectedHotel.pricePerNight * (days - 1) };

    // Select activities (2-3 per trip)
    const numActivities = days >= 7 ? 3 : 2;
    const selectedActivities = mockActivities.slice(0, numActivities);

    // Calculate costs
    const flightCost = selectedFlight.price * (formData.adults + formData.children);
    const hotelCost = selectedHotel.totalPrice;
    const activitiesCost = selectedActivities.reduce((sum, act) => sum + act.price, 0) * (formData.adults + formData.children);
    const transfersCost = 55 + 35; // Airport transfer + one city transfer
    const foodCost = pricingEstimates.foodPerDay[travelStyle] * days * (formData.adults + formData.children);

    const subtotal = flightCost + hotelCost + activitiesCost + transfersCost + foodCost;
    const contingency = subtotal * pricingEstimates.contingencyPercent;
    const taxes = subtotal * pricingEstimates.taxesAndFees;
    const totalCost = subtotal + contingency + taxes;

    return {
        flight: selectedFlight,
        hotel: selectedHotel,
        activities: selectedActivities,
        transfers: transfers,
        costs: {
            flights: flightCost,
            hotel: hotelCost,
            activities: activitiesCost,
            transfers: transfersCost,
            food: foodCost,
            subtotal: subtotal,
            contingency: contingency,
            taxes: taxes,
            total: totalCost
        },
        budgetUsed: totalCost,
        budgetPercentage: (totalCost / budget) * 100
    };
}
