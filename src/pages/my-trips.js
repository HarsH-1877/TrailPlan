import { getUserTrips, deleteTrip } from '../firebase/trips.js';
import { getCurrentUser } from '../firebase/auth.js';
import { navigateTo } from '../router.js';

export function MyTripsPage() {
  return `
    <div class="my-trips-page">
      <div class="container">
        <div class="my-trips-header">
          <h1>My Saved Trips</h1>
          <button class="btn btn-primary" onclick="navigateTo('/trip-form')">
            Plan New Trip
          </button>
        </div>
        
        <div id="trips-container" class="trips-grid">
          <div class="loading-spinner">Loading your trips...</div>
        </div>
      </div>
    </div>
    
    ${myTripsStyles}
  `;
}

export async function setupMyTripsPage() {
  const user = getCurrentUser();

  if (!user) {
    navigateTo('/');
    return;
  }

  try {
    const trips = await getUserTrips();
    const container = document.getElementById('trips-container');

    if (trips.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🗺️</div>
          <h2>No trips saved yet</h2>
          <p>Start planning your first adventure!</p>
          <button class="btn btn-primary btn-lg" onclick="navigateTo('/trip-form')">
            Create Your First Trip
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = trips.map(trip => `
      <div class="trip-card" data-trip-id="${trip.id}">
        <div class="trip-card-header">
          <h3 class="trip-name">${trip.tripName || 'Untitled Trip'}</h3>
          <button class="btn-icon delete-trip-btn" data-trip-id="${trip.id}" title="Delete trip">
            🗑️
          </button>
        </div>
        
        <div class="trip-details">
          <div class="trip-detail">
            <span class="detail-icon">📍</span>
            <span>${getDestinationDisplay(trip)}</span>
          </div>
          <div class="trip-detail">
            <span class="detail-icon">📅</span>
            <span>${formatDate(trip.startDate)} • ${trip.duration} days</span>
          </div>
          <div class="trip-detail">
            <span class="detail-icon">👥</span>
            <span>${getTravelerCount(trip)} travelers</span>
          </div>
          <div class="trip-detail">
            <span class="detail-icon">💰</span>
            <span>${formatCost(trip.costBreakdown?.total)}</span>
          </div>
        </div>
        
        <div class="trip-footer">
          <button class="btn btn-primary btn-sm view-trip-btn" data-trip-id="${trip.id}">
            View Itinerary
          </button>
          <span class="trip-date">Saved ${formatRelativeTime(trip.createdAt)}</span>
        </div>
      </div>
    `).join('');

    // Add event listeners
    document.querySelectorAll('.view-trip-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const tripId = e.target.dataset.tripId;
        await loadTripToTimeline(tripId);
      });
    });

    document.querySelectorAll('.delete-trip-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const tripId = e.target.dataset.tripId;
        if (confirm('Are you sure you want to delete this trip?')) {
          await deleteTripHandler(tripId);
        }
      });
    });

  } catch (error) {
    console.error('Error loading trips:', error);
    document.getElementById('trips-container').innerHTML = `
      <div class="error-state">
        <h2>Error loading trips</h2>
        <p>${error.message}</p>
      </div>
    `;
  }
}

async function loadTripToTimeline(tripId) {
  try {
    const trips = await getUserTrips();
    const trip = trips.find(t => t.id === tripId);

    if (trip) {
      // Store trip data in sessionStorage
      sessionStorage.setItem('tripData', JSON.stringify(trip));
      sessionStorage.setItem('itinerary', JSON.stringify(trip.itinerary));

      // Navigate to timeline
      navigateTo('/timeline');
    }
  } catch (error) {
    console.error('Error loading trip:', error);
    alert('Failed to load trip');
  }
}

async function deleteTripHandler(tripId) {
  try {
    await deleteTrip(tripId);
    // Reload the page
    setupMyTripsPage();
  } catch (error) {
    console.error('Error deleting trip:', error);
    alert('Failed to delete trip');
  }
}

// Helper functions
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getTravelerCount(trip) {
  return (parseInt(trip.adults) || 0) + (parseInt(trip.children) || 0) + (parseInt(trip.infants) || 0);
}

function getDestinationDisplay(trip) {
  // Handle destinations array (new format)
  if (trip.destinations && Array.isArray(trip.destinations) && trip.destinations.length > 0) {
    return trip.destinations[0];
  }
  // Handle single destination (old format)
  if (trip.destination) {
    return trip.destination;
  }
  // Fallback to tripName or Unknown
  return trip.tripName || 'Unknown';
}

function formatCost(cost) {
  if (!cost) return 'N/A';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(cost);
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'recently';

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

const myTripsStyles = `
  <style>
    .my-trips-page {
      min-height: 100vh;
      padding-top: calc(var(--header-height) + var(--spacing-8));
      padding-bottom: var(--spacing-16);
      background: var(--color-bg-primary);
    }
    
    .my-trips-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-8);
    }
    
    .my-trips-header h1 {
      font-size: var(--font-size-4xl);
      background: var(--color-brand-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .trips-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--spacing-6);
    }
    
    .trip-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-medium);
      border-radius: var(--radius-xl);
      padding: var(--spacing-6);
      transition: all var(--transition-base);
    }
    
    .trip-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
      border-color: var(--color-brand-primary);
    }
    
    .trip-card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: var(--spacing-4);
    }
    
    .trip-name {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin: 0;
    }
    
    .btn-icon {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: var(--font-size-xl);
      opacity: 0.6;
      transition: opacity var(--transition-fast);
    }
    
    .btn-icon:hover {
      opacity: 1;
    }
    
    .trip-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-5);
    }
    
    .trip-detail {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }
    
    .detail-icon {
      font-size: var(--font-size-base);
    }
    
    .trip-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--spacing-4);
      border-top: 1px solid var(--color-border-subtle);
    }
    
    .trip-date {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
    }
    
    .empty-state,
    .error-state,
    .loading-spinner {
      text-align: center;
      padding: var(--spacing-16) var(--spacing-8);
      grid-column: 1 / -1;
    }
    
    .empty-icon {
      font-size: 64px;
      margin-bottom: var(--spacing-4);
    }
    
    .empty-state h2,
    .error-state h2 {
      font-size: var(--font-size-2xl);
      margin-bottom: var(--spacing-3);
    }
    
    .empty-state p,
    .error-state p {
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-6);
    }
    
    @media (max-width: 768px) {
      .my-trips-header {
        flex-direction: column;
        gap: var(--spacing-4);
        align-items: flex-start;
      }
      
      .trips-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
`;
