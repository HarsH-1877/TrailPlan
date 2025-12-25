import { Navbar, navbarStyles, updateNavbar } from '../components/navbar.js';
import { generateItinerary } from '../api/api-service.js';
import { getCurrentUser } from '../firebase/auth.js';

export function TripFormPage() {
  return `
    ${navbarStyles}
    ${Navbar()}
    
    <div class="trip-form-page">
      <div class="form-container">
        <div class="form-header">
          <h1 class="form-title">Plan Your Trip</h1>
          <p class="form-subtitle">Tell us about your dream trip and we'll create the perfect itinerary</p>
        </div>
        
        <form id="trip-form" class="trip-form">
          <!-- Basic Information -->
          <section class="form-section">
            <h2 class="section-heading">
              <span class="section-number">1</span>
              Basic Information
            </h2>
            
            <div class="form-grid">
              <div class="form-group full-width">
                <label class="label">Trip Name (Optional)</label>
                <input 
                  type="text" 
                  id="tripName" 
                  class="input" 
                  placeholder="Summer Trip 2025" 
                />
              </div>
              
              <div class="form-group">
                <label class="label">Trip Type</label>
                <select id="tripType" class="select">
                  <option value="round-trip">Round Trip</option>
                  <option value="one-way">One Way</option>
                  <option value="multi-city">Multi-City</option>
                </select>
              </div>
            </div>
          </section>
          
          <!-- Locations -->
          <section class="form-section">
            <h2 class="section-heading">
              <span class="section-number">2</span>
              Locations
            </h2>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="label">Starting From</label>
                <div class="autocomplete-wrapper">
                  <input 
                    type="text" 
                    id="startLocation" 
                    class="input autocomplete-input" 
                    placeholder="New York, NY" 
                    autocomplete="off"
                  />
                  <div id="startLocationResults" class="autocomplete-results"></div>
                </div>
                <p class="form-helper">City or airport</p>
              </div>
              
              <div class="form-group">
                <label class="label">Destination(s)</label>
                <div class="autocomplete-wrapper">
                  <input 
                    type="text" 
                    id="destination" 
                    class="input autocomplete-input" 
                    placeholder="Paris, France" 
                    autocomplete="off"
                  />
                  <div id="destinationResults" class="autocomplete-results"></div>
                </div>
                <p class="form-helper">Add multiple destinations for multi-city trips</p>
              </div>
            </div>
            
            <div id="destinationsList" class="destinations-list"></div>
            <button type="button" class="btn btn-secondary btn-sm" onclick="addDestination()">
              + Add Another Destination
            </button>
          </section>
          
          <!-- Dates & Duration -->
          <section class="form-section">
            <h2 class="section-heading">
              <span class="section-number">3</span>
              Dates & Duration
            </h2>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="label">
                  <input type="checkbox" id="flexibleDates" class="checkbox" />
                  Flexible Dates
                </label>
                <p class="form-helper">Get better prices by being flexible</p>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="label">Start Date</label>
                <input type="date" id="startDate" class="input" />
              </div>
              
              <div class="form-group">
                <label class="label">Duration (days)</label>
                <input 
                  type="number" 
                  id="duration" 
                  class="input" 
                  min="1" 
                  max="60" 
                  value="7" 
                  placeholder="7"
                />
              </div>
              
              <div class="form-group">
                <label class="label">End Date</label>
                <input type="date" id="endDate" class="input" disabled />
                <p class="form-helper">Calculated automatically</p>
              </div>
            </div>
          </section>
          
          <!-- Travelers -->
          <section class="form-section">
            <h2 class="section-heading">
              <span class="section-number">4</span>
              Travelers
            </h2>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="label">Adults (18+)</label>
                <div class="number-input">
                  <button type="button" class="number-btn" onclick="adjustCount('adults', -1)">−</button>
                  <input type="number" id="adults" class="input number-display" value="2" min="1" readonly />
                  <button type="button" class="number-btn" onclick="adjustCount('adults', 1)">+</button>
                </div>
              </div>
              
              <div class="form-group">
                <label class="label">Children (2-17)</label>
                <div class="number-input">
                  <button type="button" class="number-btn" onclick="adjustCount('children', -1)">−</button>
                  <input type="number" id="children" class="input number-display" value="0" min="0" readonly />
                  <button type="button" class="number-btn" onclick="adjustCount('children', 1)">+</button>
                </div>
              </div>
              
              <div class="form-group">
                <label class="label">Infants (0-2)</label>
                <div class="number-input">
                  <button type="button" class="number-btn" onclick="adjustCount('infants', -1)">−</button>
                  <input type="number" id="infants" class="input number-display" value="0" min="0" readonly />
                  <button type="button" class="number-btn" onclick="adjustCount('infants', 1)">+</button>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Budget -->
          <section class="form-section">
            <h2 class="section-heading">
              <span class="section-number">5</span>
              Budget
            </h2>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="label">Currency</label>
                <select id="currency" class="select">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
            
            <div class="form-group full-width">
              <label class="label">Total Budget <span class="text-sm font-normal text-gray-500">(per person)</span>: <span id="budgetValue" class="text-brand font-bold">$5,000</span></label>
              <input 
                type="range" 
                id="budget" 
                class="budget-slider" 
                min="500" 
                max="50000" 
                step="100" 
                value="5000"
              />
              <div class="budget-suggestions">
                <button type="button" class="budget-suggestion" onclick="setBudget(2000)">$2,000</button>
                <button type="button" class="budget-suggestion" onclick="setBudget(5000)">$5,000</button>
                <button type="button" class="budget-suggestion" onclick="setBudget(10000)">$10,000</button>
                <button type="button" class="budget-suggestion" onclick="setBudget(20000)">$20,000</button>
              </div>
            </div>
          </section>
          
          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="btn btn-secondary btn-lg" onclick="navigateTo('/')">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary btn-lg">
              Create My Itinerary
            </button>
          </div>
        </form>
      </div>
    </div>
    
    ${tripFormStyles}
  `;
}

const tripFormStyles = `
  <style>
    .trip-form-page {
      min-height: 100vh;
      padding-top: var(--header-height);
      background: var(--color-bg-primary);
    }
    
    .form-container {
      max-width: 900px;
      margin: 0 auto;
      padding: var(--spacing-16) var(--spacing-6) var(--spacing-24);
    }
    
    .form-header {
      text-align: center;
      margin-bottom: var(--spacing-16);
    }
    
    .form-title {
      font-size: var(--font-size-5xl);
      background: var(--color-brand-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--spacing-4);
    }
    
    .form-subtitle {
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
    }
    
    .trip-form {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-2xl);
      padding: var(--spacing-8);
    }
    
    .form-section {
      margin-bottom: var(--spacing-12);
      padding-bottom: var(--spacing-12);
      border-bottom: 1px solid var(--color-border-subtle);
    }
    
    .form-section:last-of-type {
      border-bottom: none;
    }
    
    .section-heading {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-6);
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }
    
    .section-number {
      width: 36px;
      height: 36px;
      background: var(--color-brand-gradient);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: white;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-6);
    }
    
    .form-group.full-width {
      grid-column: 1 / -1;
    }
    
    .checkbox {
      width: 18px;
      height: 18px;
      margin-right: var(--spacing-2);
      cursor: pointer;
      accent-color: var(--color-brand-primary);
    }
    
    .textarea {
      width: 100%;
      min-height: 100px;
      padding: var(--spacing-3) var(--spacing-4);
      font-size: var(--font-size-base);
      font-family: var(--font-family-primary);
      color: var(--color-text-primary);
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-md);
      resize: vertical;
      transition: all var(--transition-fast);
    }
    
    .textarea:focus {
      outline: none;
      border-color: var(--color-brand-primary);
      box-shadow: 0 0 0 3px var(--color-brand-glow);
    }
    
    /* Autocomplete */
    .autocomplete-wrapper {
      position: relative;
    }
    
    .autocomplete-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border-medium);
      border-radius: var(--radius-md);
      margin-top: var(--spacing-1);
      max-height: 200px;
      overflow-y: auto;
      z-index: var(--z-dropdown);
      display: none;
    }
    
    .autocomplete-results.active {
      display: block;
    }
    
    .autocomplete-item {
      padding: var(--spacing-3) var(--spacing-4);
      cursor: pointer;
      transition: background var(--transition-fast);
    }
    
    .autocomplete-item:hover {
      background: var(--glass-bg);
    }
    
    /* Destinations List */
    .destinations-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-4);
    }
    
    .destination-tag {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-4);
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
    }
    
    .destination-remove {
      cursor: pointer;
      color: var(--color-text-tertiary);
      transition: color var(--transition-fast);
    }
    
    .destination-remove:hover {
      color: var(--color-error);
    }
    
    /* Number Input */
    .number-input {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }
    
    .number-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xl);
      cursor: pointer;
      transition: all var(--transition-fast);
      color: var(--color-text-primary);
    }
    
    .number-btn:hover {
      background: var(--glass-bg);
      border-color: var(--color-brand-primary);
    }
    
    .number-display {
      flex: 1;
      text-align: center;
      pointer-events: none;
    }
    
    /* Budget Slider */
    .budget-slider {
      width: 100%;
      height: 8px;
      border-radius: var(--radius-full);
      background: var(--color-bg-elevated);
      outline: none;
      -webkit-appearance: none;
      margin: var(--spacing-4) 0;
    }
    
    .budget-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--color-brand-gradient);
      cursor: pointer;
      box-shadow: 0 0 8px var(--color-brand-glow);
    }
    
    .budget-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--color-brand-gradient);
      cursor: pointer;
      border: none;
      box-shadow: 0 0 8px var(--color-brand-glow);
    }
    
    .budget-suggestions {
      display: flex;
      gap: var(--spacing-2);
      flex-wrap: wrap;
    }
    
    .budget-suggestion {
      padding: var(--spacing-2) var(--spacing-4);
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
      color: var(--color-text-secondary);
    }
    
    .budget-suggestion:hover {
      background: var(--color-brand-gradient);
      color: white;
      border-color: transparent;
    }
    
    /* Preference Buttons */
    .preference-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--spacing-3);
      margin-top: var(--spacing-2);
    }
    
    .preference-btn {
      padding: var(--spacing-4);
      background: var(--color-bg-elevated);
      border: 2px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all var(--transition-fast);
      color: var(--color-text-primary);
    }
    
    .preference-btn:hover {
      border-color: var(--color-brand-primary);
      background: var(--glass-bg);
    }
    
    .preference-btn.active {
      background: var(--color-brand-gradient);
      border-color: transparent;
      color: white;
      box-shadow: var(--shadow-glow);
    }
    
    /* Form Actions */
    .form-actions {
      display: flex;
      gap: var(--spacing-4);
      justify-content: flex-end;
      margin-top: var(--spacing-8);
    }
    
    @media (max-width: 768px) {
      .form-container {
        padding: var(--spacing-8) var(--spacing-4);
      }
      
      .trip-form {
        padding: var(--spacing-6) var(--spacing-4);
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .preference-buttons {
        grid-template-columns: 1fr 1fr;
      }
      
      .form-actions {
        flex-direction: column-reverse;
      }
      
      .form-actions button {
        width: 100%;
      }
    }
  </style>
`;

export function setupTripForm() {
  console.log('🔧 setupTripForm() called - initializing trip form...');

  // Update navbar with current user state
  const currentUser = getCurrentUser();
  updateNavbar(currentUser);

  // Mock location data for autocomplete
  const locations = [
    'New York, NY (JFK)',
    'Los Angeles, CA (LAX)',
    'Chicago, IL (ORD)',
    'San Francisco, CA (SFO)',
    'Paris, France (CDG)',
    'London, UK (LHR)',
    'Tokyo, Japan (NRT)',
    'Dubai, UAE (DXB)',
    'Singapore (SIN)',
    'Barcelona, Spain (BCN)',
    'Rome, Italy (FCO)',
    'Amsterdam, Netherlands (AMS)',
    'Sydney, Australia (SYD)',
    'Hong Kong (HKG)',
    'Bangkok, Thailand (BKK)',
    'Istanbul, Turkey (IST)',
    'Mumbai, India (BOM)',
    'Delhi, India (DEL)',
    'Toronto, Canada (YYZ)',
    'Mexico City, Mexico (MEX)'
  ];

  // Make destinations global for form submission
  window.tripFormDestinations = [];
  console.log('✅ Trip form destinations initialized');

  // Autocomplete functionality
  function setupAutocomplete(inputId, resultsId) {
    const input = document.getElementById(inputId);
    const results = document.getElementById(resultsId);

    input.addEventListener('input', (e) => {
      const value = e.target.value.toLowerCase();

      if (value.length < 2) {
        results.classList.remove('active');
        return;
      }

      const matches = locations.filter(loc =>
        loc.toLowerCase().includes(value)
      );

      if (matches.length > 0) {
        results.innerHTML = matches.slice(0, 5).map(loc =>
          `<div class="autocomplete-item" onclick="selectLocation('${inputId}', '${resultsId}', '${loc}')">${loc}</div>`
        ).join('');
        results.classList.add('active');
      } else {
        results.classList.remove('active');
      }
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !results.contains(e.target)) {
        results.classList.remove('active');
      }
    });
  }

  window.selectLocation = function (inputId, resultsId, location) {
    document.getElementById(inputId).value = location;
    document.getElementById(resultsId).classList.remove('active');

    if (inputId === 'destination' && !window.tripFormDestinations.includes(location)) {
      window.tripFormDestinations.push(location);
      updateDestinationsList();
    }
  };

  window.addDestination = function () {
    const input = document.getElementById('destination');
    const value = input.value.trim();

    if (value && !window.tripFormDestinations.includes(value)) {
      window.tripFormDestinations.push(value);
      updateDestinationsList();
    }
    // Always clear and focus to allow adding another
    input.value = '';
    input.focus();
  };

  function updateDestinationsList() {
    const list = document.getElementById('destinationsList');
    list.innerHTML = window.tripFormDestinations.map((dest, index) =>
      `<div class="destination-tag">
          ${dest}
          <span class="destination-remove" onclick="removeDestination(${index})">✕</span>
        </div>`
    ).join('');
  }

  window.removeDestination = function (index) {
    window.tripFormDestinations.splice(index, 1);
    updateDestinationsList();
  };

  // Number input adjustments
  window.adjustCount = function (fieldId, delta) {
    const input = document.getElementById(fieldId);
    const currentValue = parseInt(input.value) || 0;
    const min = parseInt(input.min) || 0;
    const newValue = Math.max(min, currentValue + delta);
    input.value = newValue;
  };

  // Budget slider
  // Budget functionality
  const exchangeRates = {
    USD: 1,
    EUR: 0.95,
    GBP: 0.79,
    JPY: 151,
    INR: 84
  };

  window.updateBudgetRange = function () {
    const currency = document.getElementById('currency').value;
    const rate = exchangeRates[currency] || 1;
    const slider = document.getElementById('budget');

    // Scale limits (Base 50k USD max)
    const newMax = Math.round(50000 * rate / 1000) * 1000;
    const newMin = Math.round(500 * rate / 100) * 100;

    slider.min = newMin;
    slider.max = newMax;
    slider.step = Math.round(100 * rate);

    // Update suggestions and current value
    const suggestions = document.querySelectorAll('.budget-suggestion');
    const usdValues = [2000, 5000, 10000, 20000];
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : '₹';

    suggestions.forEach((btn, index) => {
      if (usdValues[index]) {
        const val = Math.round(usdValues[index] * rate);
        btn.onclick = () => setBudget(val);
        btn.textContent = `${symbol}${val.toLocaleString()}`;
      }
    });

    // Reset to default equivalent (approx 5000 USD)
    setBudget(Math.round(5000 * rate));
  };

  window.setBudget = function (value) {
    const slider = document.getElementById('budget');
    const display = document.getElementById('budgetValue');
    const currency = document.getElementById('currency').value;
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : '₹';

    slider.value = value;
    display.textContent = `${symbol}${parseInt(value).toLocaleString()}`;
  };

  // Initialize budget listeners
  const currencySelect = document.getElementById('currency');
  if (currencySelect) {
    currencySelect.addEventListener('change', updateBudgetRange);
    // Initialize once
    // updateBudgetRange(); // Don't call immediately here to avoid overriding initial state if any? 
    // Actually setupTripForm runs on load, so we should init range.
    // But we might want to respect existing value if re-editing (not implemented yet).
  }

  // Preference selection
  window.selectPreference = function (fieldId, value, button) {
    const container = button.parentElement;
    const buttons = container.querySelectorAll('.preference-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const field = document.getElementById(fieldId); // Added check
    if (field) field.value = value;
  };

  // Initialize autocomplete
  setupAutocomplete('startLocation', 'startLocationResults');
  setupAutocomplete('destination', 'destinationResults');

  // Budget slider update
  const slider = document.getElementById('budget');
  const display = document.getElementById('budgetValue');
  if (slider && display) {
    slider.addEventListener('input', (e) => {
      const currency = document.getElementById('currency').value;
      const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : '₹';
      display.textContent = `${symbol}${parseInt(e.target.value).toLocaleString()}`;
    });
  }



  // Duration to end date calculation
  const startDateInput = document.getElementById('startDate');
  const durationInput = document.getElementById('duration');
  const endDateInput = document.getElementById('endDate');

  function calculateEndDate() {
    if (startDateInput && durationInput && endDateInput && startDateInput.value && durationInput.value) {
      const start = new Date(startDateInput.value);
      const duration = parseInt(durationInput.value);
      const end = new Date(start);
      end.setDate(end.getDate() + duration);
      endDateInput.value = end.toISOString().split('T')[0];
    }
  }

  if (startDateInput && durationInput) {
    startDateInput.addEventListener('change', calculateEndDate);
    durationInput.addEventListener('input', calculateEndDate);
  }

  // Form submission
  const tripForm = document.getElementById('trip-form');
  const submitButton = document.querySelector('button[type="submit"]');

  console.log('🔍 Looking for form element with ID "trip-form"...');
  console.log('🔍 Form element found:', tripForm ? 'YES ✅' : 'NO ❌');
  console.log('🔍 Submit button found:', submitButton ? 'YES ✅' : 'NO ❌');

  // Form submission handler function
  async function handleFormSubmit(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('🎯 FORM SUBMITTED! Handler triggered!');
    console.log('📋 Event details:', e);

    // Validation
    const startLocation = document.getElementById('startLocation')?.value.trim() || '';
    const destInput = document.getElementById('destination')?.value.trim() || '';
    const startDate = document.getElementById('startDate')?.value || '';
    const duration = parseInt(document.getElementById('duration')?.value || '0');
    const adults = parseInt(document.getElementById('adults')?.value || '0');
    const children = parseInt(document.getElementById('children')?.value || '0');
    const infants = parseInt(document.getElementById('infants')?.value || '0');

    console.log('📊 Validation data:', { startLocation, destInput, startDate, duration, adults });

    if (!startLocation) {
      console.log('❌ Validation failed: No start location');
      alert('Please enter a starting location');
      return;
    }

    if (window.tripFormDestinations.length === 0 && !destInput) {
      console.log('❌ Validation failed: No destination');
      alert('Please enter at least one destination');
      return;
    }

    if (!startDate) {
      console.log('❌ Validation failed: No start date');
      alert('Please select a start date');
      return;
    }

    if (!duration || duration < 1 || duration > 60) {
      console.log('❌ Validation failed: Invalid duration');
      alert('Duration must be between 1 and 60 days');
      return;
    }

    const totalTravelers = adults + children + infants;
    if (totalTravelers < 1 || totalTravelers > 20) {
      console.log('❌ Validation failed: Invalid traveler count');
      alert('Total travelers must be between 1 and 20');
      return;
    }

    console.log('✅ All validation passed!');

    // Collect form data
    const formData = {
      tripName: document.getElementById('tripName')?.value || 'My Trip',
      tripType: document.getElementById('tripType')?.value,
      startLocation: startLocation,
      destinations: window.tripFormDestinations.length > 0 ? window.tripFormDestinations : [destInput],
      flexibleDates: document.getElementById('flexibleDates')?.checked,
      startDate: startDate,
      duration: duration,
      endDate: document.getElementById('endDate')?.value,
      adults: adults,
      children: children,
      infants: infants,
      currency: document.getElementById('currency')?.value,
      budget: parseInt(document.getElementById('budget')?.value || '0'),
      travelStyle: document.getElementById('travelStyle')?.value,
      optimizeFor: document.getElementById('optimizeFor')?.value,
      familyFriendly: document.getElementById('familyFriendly')?.checked,
      localExperience: document.getElementById('localExperience')?.checked,
      maxStops: document.getElementById('maxStops')?.value,
      preferences: {
        pace: document.getElementById('travelStyle')?.value || 'moderate',
        interests: getSelectedInterests(),
        adventureLevel: getAdventureLevel()
      }
    };

    console.log('📦 Form data collected:', formData);

    // Show loading overlay
    console.log('🔄 Showing loading overlay...');
    // showLoadingOverlay('Generating your optimized itinerary...'); // Disabled - api-service.js handles this
    console.log('✅ Loading overlay shown via api-service.js');

    try {
      console.log('🌐 Calling backend API...');
      console.log('🔗 Using generateItinerary function:', typeof generateItinerary);

      const itinerary = await generateItinerary(formData);
      console.log('✅ Itinerary received:', itinerary);

      // Hide loading
      // hideLoadingOverlay(); // Disabled - api-service.js handles this
      console.log('✅ Loading hidden via api-service.js');

      // Validate and store itinerary in sessionStorage
      if (itinerary && typeof itinerary === 'object') {
        sessionStorage.setItem('tripData', JSON.stringify(itinerary));
        console.log('💾 Itinerary stored in sessionStorage');

        // Navigate to timeline
        console.log('🚀 Navigating to timeline...');
        if (typeof navigateTo !== 'undefined') {
          console.log('Using navigateTo() function');
          navigateTo('/timeline');
        } else {
          console.log('Using window.location.hash');
          window.location.hash = '/timeline';
        }
        console.log('✅ Navigation complete!');
      } else {
        console.error('❌ Invalid itinerary data received:', itinerary);
        alert('Failed to generate itinerary: The server returned invalid data.\n\nThis usually means the Gemini API is having issues. The timeline will show mock data instead.');

        // Store form data so timeline can generate mock itinerary
        sessionStorage.setItem('tripData', JSON.stringify(formData));
        window.location.hash = '/timeline';
      }
    } catch (error) {
      // hideLoadingOverlay(); // Disabled - api-service.js handles this in finally block
      console.error('❌ Error generating itinerary:', error);
      console.error('❌ Error details:', error.stack);

      // Store form data so timeline can still show something
      sessionStorage.setItem('tripData', JSON.stringify(formData));

      alert(`Failed to generate itinerary: ${error.message}\n\nShowing mock itinerary instead.`);

      // Navigate to timeline anyway with mock data
      window.location.hash = '/timeline';
    }
  }

  // Attach form submit listener
  if (tripForm) {
    console.log('✅ Form found! Attaching submit event listener...');
    tripForm.addEventListener('submit', handleFormSubmit);
    console.log('✅ Form submit listener attached!');
  } else {
    console.error('❌ CRITICAL: Form element with ID "trip-form" NOT FOUND!');
  }

  // BACKUP: Also attach click listener to submit button directly
  if (submitButton) {
    console.log('✅ Submit button found! Attaching backup click listener...');
    submitButton.addEventListener('click', (e) => {
      console.log('🔘 Submit button CLICKED directly!');
      handleFormSubmit(e);
    });
    console.log('✅ Button click listener attached!');
  } else {
    console.error('❌ WARNING: Submit button NOT FOUND!');
  }

  // Helper functions
  function getSelectedInterests() {
    const interests = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"][id*="interest"]');
    checkboxes.forEach(cb => {
      if (cb.checked && cb.value) {
        interests.push(cb.value);
      }
    });
    return interests.length > 0 ? interests : ['general sightseeing'];
  }

  function getAdventureLevel() {
    const travelStyle = document.getElementById('travelStyle')?.value;
    const map = {
      'budget': 'low',
      'standard': 'medium',
      'luxury': 'medium',
      'adventure': 'high',
      'relaxation': 'low'
    };
    return map[travelStyle] || 'medium';
  }

  function showLoadingOverlay(message) {
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.id = 'itinerary-loading-overlay';
    overlay.innerHTML = `
      <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"><\/script>
      <div class="loading-content">
        <dotlottie-player 
          src="/loading.lottie" 
          background="transparent" 
          speed="1" 
          style="width: 200px; height: 200px; margin-bottom: 2rem;" 
          loop 
          autoplay>
        </dotlottie-player>
        <div class="loading-messages">
          <p class="loading-message active">${message}</p>
          <p class="loading-message">Analyzing destinations...</p>
          <p class="loading-message">Finding best flights...</p>
          <p class="loading-message">Selecting optimal hotels...</p>
          <p class="loading-message">Creating daily schedules...</p>
          <p class="loading-message">Optimizing your route...</p>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #itinerary-loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }
      .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: white;
      }
      .loading-spinner {
        width: 60px;
        height: 60px;
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-top-color: var(--color-brand-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 2rem;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .loading-messages {
        min-height: 60px;
      }
      .loading-message {
        font-size: 1.1rem;
        margin: 0.5rem 0;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .loading-message.active {
        opacity: 1;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Rotate through messages
    const messages = overlay.querySelectorAll('.loading-message');
    let currentIndex = 0;

    const interval = setInterval(() => {
      messages[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % messages.length;
      messages[currentIndex].classList.add('active');
    }, 3000);

    overlay.dataset.intervalId = interval;
  }

  function hideLoadingOverlay() {
    const overlay = document.getElementById('itinerary-loading-overlay');
    if (overlay) {
      const intervalId = overlay.dataset.intervalId;
      if (intervalId) {
        clearInterval(parseInt(intervalId));
      }
      overlay.remove();
    }
  }
}
