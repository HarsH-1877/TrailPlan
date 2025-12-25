import { Navbar, navbarStyles, updateNavbar } from '../components/navbar.js';
import { getCurrentUser } from '../firebase/auth.js';

export function LandingPage() {
  return `
    ${navbarStyles}
    ${Navbar()}
    
    <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg hero-bg-1 active"></div>
      <div class="hero-bg hero-bg-2"></div>
      <div class="hero-bg hero-bg-3"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title animate-on-load">
          Adventure Awaits.<br />
          Your Journey, Perfectly Planned
        </h1>
        <p class="hero-subtitle animate-on-load">
          Craft bespoke itineraries, visualize your trip timeline, and track every cost in real-time.
        </p>

        <div class="hero-actions">
          <button class="btn btn-primary btn-xl" onclick="navigateTo('/trip-form')">
            Create Trip
          </button>
          <button class="btn btn-secondary-outline btn-xl" onclick="scrollToSection('features')">
            Learn More
          </button>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="features" class="how-it-works">
      <div class="container">
        <h2 class="section-title">How It Works</h2>

        <div class="steps-grid">
          <div class="step-card animate-on-load">
            <div class="step-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <!-- Light bulb -->
                <circle cx="24" cy="18" r="10" stroke="url(#gradient2)" stroke-width="2.5" />
                <path d="M20 26c0 2 1 4 4 4s4-2 4-4" stroke="url(#gradient2)" stroke-width="2.5" stroke-linecap="round" />
                <rect x="21" y="30" width="6" height="4" rx="1" stroke="url(#gradient2)" stroke-width="2" />
                <path d="M18 34h12" stroke="url(#gradient2)" stroke-width="2.5" stroke-linecap="round" />
                <path d="M24 8v-4M14 11l-3-3M34 11l3-3" stroke="url(#gradient2)" stroke-width="2" stroke-linecap="round" />
                <defs>
                  <linearGradient id="gradient2" x1="4" y1="4" x2="44" y2="44">
                    <stop offset="0%" stop-color="#ff7b3d" />
                    <stop offset="100%" stop-color="#ff9654" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3 class="step-title">Dream</h3>
            <p class="step-description">Enter your dream destinations and travel preferences</p>
          </div>

          <div class="step-card animate-on-load">
            <div class="step-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <!-- Checklist -->
                <rect x="10" y="8" width="28" height="32" rx="2" stroke="url(#gradient3)" stroke-width="2.5" />
                <path d="M16 16l3 3 5-5" stroke="url(#gradient3)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M16 24l3 3 5-5" stroke="url(#gradient3)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M16 32l3 3 5-5" stroke="url(#gradient3)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                <defs>
                  <linearGradient id="gradient3" x1="8" y1="12" x2="40" y2="36">
                    <stop offset="0%" stop-color="#ff7b3d" />
                    <stop offset="100%" stop-color="#ff9654" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3 class="step-title">Plan</h3>
            <p class="step-description">Get your personalized timeline and optimized budget</p>
          </div>

          <div class="step-card animate-on-load">
            <div class="step-icon">
              <img src="/images/go-icon.png" alt="Go" style="width: 96px; height: 96px;" />
            </div>
            <h3 class="step-title">Go</h3>
            <p class="step-description">Book directly and embark on your perfect adventure</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Visual Timeline Preview -->
    <section id="about" class="timeline-preview">
      <div class="container">
        <h2 class="section-title">Visual Timeline</h2>
        <p class="section-subtitle">See your entire trip at a glance – every flight, hotel, activity, and more</p>

        <div class="preview-mockup">
          <div class="mockup-card">
            <div class="mockup-header">
              <div class="mockup-dot"></div>
              <div class="mockup-dot"></div>
              <div class="mockup-dot"></div>
            </div>
            <div class="mockup-content">
              <div class="mockup-timeline">
                <div class="mockup-day">
                  <div class="mockup-label">DAY 1 - OCT 15</div>
                  <div class="mockup-item purple-item">
                    <div class="item-badge">Flight</div>
                    <div class="item-title">JFK to CDG</div>
                    <div class="item-time">10:00 AM - 10:00 PM</div>
                  </div>
                  <div class="mockup-item blue-item">
                    <div class="item-badge">Hotel</div>
                    <div class="item-title">Hotel Bradford Elysées</div>
                    <div class="item-time">Check-in 11:30 PM</div>
                  </div>
                </div>
                <div class="mockup-day">
                  <div class="mockup-label">DAY 2 - OCT 16</div>
                  <div class="mockup-item green-item">
                    <div class="item-badge">Activity</div>
                    <div class="item-title">Eiffel Tower Tour</div>
                    <div class="item-time">9:00 AM</div>
                  </div>
                  <div class="mockup-item green-item">
                    <div class="item-badge">Dining</div>
                    <div class="item-title">Café de Flore</div>
                    <div class="item-time">1:00 PM</div>
                  </div>
                </div>
                <div class="mockup-day">
                  <div class="mockup-label">DAY 3 - OCT 17</div>
                  <div class="mockup-item blue-item">
                    <div class="item-badge">Hotel</div>
                    <div class="item-title">Hotel Bradford Elysées</div>
                    <div class="item-time">Check-out 11:00 AM</div>
                  </div>
                  <div class="mockup-item purple-item">
                    <div class="item-badge">Return Flight</div>
                    <div class="item-title">CDG to JFK</div>
                    <div class="item-time">2:00 PM - 4:00 PM</div>
                  </div>
                </div>
              </div>
              
              <!-- Sidebar Container for vertical stacking -->
              <div class="mockup-sidebar-wrapper">
                <!-- Cost Breakdown Panel -->
                <div class="mockup-sidebar">
                  <div class="sidebar-header">Cost Breakdown</div>
                  <div class="cost-item">
                    <span class="cost-label">✈️ Flights</span>
                    <span class="cost-value">$850</span>
                  </div>
                  <div class="cost-item">
                    <span class="cost-label">🏨 Hotels</span>
                    <span class="cost-value">$420</span>
                  </div>
                  <div class="cost-item">
                    <span class="cost-label">🎯 Activities</span>
                    <span class="cost-value">$180</span>
                  </div>
                  <div class="cost-item">
                    <span class="cost-label">🍽️ Meals</span>
                    <span class="cost-value">$240</span>
                  </div>
                  <div class="cost-divider"></div>
                  <div class="cost-item cost-total">
                    <span class="cost-label">Total</span>
                    <span class="cost-value">$1,690</span>
                  </div>
                </div>
                
                <!-- Recommendations Box (Separate) -->
                <div class="mockup-sidebar">
                  <div class="sidebar-header">🎯 Recommended Activities</div>
                  
                  <!-- Search Box -->
                  <div class="activity-search-box">
                    <input type="text" class="activity-search-input" placeholder="Search activities..." disabled>
                    <span class="search-icon">🔍</span>
                  </div>
                  
                  <!-- Category Pills -->
                  <div class="activity-categories">
                    <button class="category-pill active">All</button>
                    <button class="category-pill">🏛️ Sights</button>
                    <button class="category-pill">🍽️ Food</button>
                  </div>
                  
                  <!-- Recommended Activities List -->
                  <div class="activity-recommendations">
                    <div class="activity-card">
                      <div class="activity-image">🚶</div>
                      <div class="activity-info">
                        <div class="activity-name">City Tour</div>
                        <div class="activity-meta">
                          <span class="activity-duration">⏱️ 3h</span>
                          <span class="activity-rating">⭐ 4.8</span>
                        </div>
                        <div class="activity-price">₹1,500</div>
                      </div>
                    </div>
                    <div class="activity-card">
                      <div class="activity-image">🍴</div>
                      <div class="activity-info">
                        <div class="activity-name">Food Tour</div>
                        <div class="activity-meta">
                          <span class="activity-duration">⏱️ 2.5h</span>
                          <span class="activity-rating">⭐ 4.9</span>
                        </div>
                        <div class="activity-price">₹2,500</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- Trust Section -->
    <section class="trust-section">
      <div class="container">
        <div class="trust-grid">
          <div class="trust-item">
            <div class="trust-number">50+</div>
            <div class="trust-label">Countries</div>
          </div>
          <div class="trust-item">
            <div class="trust-number">4.9★</div>
            <div class="trust-label">User Rating</div>
          </div>
          <div class="trust-item">
            <div class="trust-number">20%</div>
            <div class="trust-label">Budget Saved</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container text-center">
        <h2 class="cta-title">Ready to Plan Your Perfect Trip?</h2>
        <p class="cta-subtitle">Join thousands of travelers who trust TrailPlan</p>
        <button class="btn btn-primary btn-lg" onclick="navigateTo('/trip-form')">
          Start Planning Now
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="logo-text">TrailPlan</div>
            <p class="footer-tagline">Plan. Optimize. Go.</p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2025 TrailPlan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
    
    ${landingPageStyles}
  `;
}

const landingPageStyles = `
    <style>
    /* Hero Section */
    .hero {
      position: relative;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .hero-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 1.5s ease-in-out;
      z-index: 0;
    }

    .hero-bg.active {
      opacity: 1;
    }

    .hero-bg-1 {
      background-image: url('/images/hero-bg-1.jpg');
    }

    .hero-bg-2 {
      background-image: url('/images/hero-bg-3.png');
    }

    .hero-bg-3 {
      background-image: url('/images/hero-bg-2.jpg');
    }
    
    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(10, 10, 10, 0.8) 100%);
      z-index: 1;
    }
    
    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 123, 61, 0.1) 0%, rgba(10, 10, 10, 0.9) 100%);
    }
    
    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 900px;
      padding: 0 var(--spacing-6);
    }
    
    .hero-title {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: var(--font-weight-extrabold);
      line-height: 1.1;
      margin-top: 60px;
      margin-bottom: var(--spacing-6);
      color: #ffffff;
    }
    
    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.25rem);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-10);
      line-height: 1.6;
    }
    
    .hero-actions {
      display: flex;
      gap: var(--spacing-4);
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .btn-xl {
      padding: var(--spacing-5) var(--spacing-10);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-xl);
      transition: all var(--transition-base);
    }
    
    .btn-secondary-outline {
      background: transparent;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
    }
    
    .btn-secondary-outline:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(255, 123, 61, 0.3);
    }

    /* How It Works Section */
    .how-it-works {
      padding: var(--spacing-24) 0;
      background: var(--color-bg-secondary);
    }
    
    .section-title {
      text-align: center;
      font-size: var(--font-size-4xl);
      margin-bottom: var(--spacing-12);
    }
    
    .section-subtitle {
      text-align: center;
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-12);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-8);
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .step-card {
      text-align: center;
      padding: var(--spacing-8);
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      transition: all var(--transition-base);
    }
    
    .step-card:hover {
      transform: translateY(-8px);
      border-color: var(--color-border-medium);
      box-shadow: var(--shadow-xl);
    }
    
    .step-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto var(--spacing-6);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--glass-bg);
      border: 2px solid var(--glass-border);
      border-radius: 50%;
    }
    
    .step-title {
      font-size: var(--font-size-2xl);
      margin-bottom: var(--spacing-3);
      background: var(--color-brand-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .step-description {
      color: var(--color-text-secondary);
      line-height: 1.6;
    }

    /* Timeline Preview Section */
    .timeline-preview {
      padding: var(--spacing-24) 0;
      background: var(--color-bg-primary);
    }
    
    .preview-mockup {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .mockup-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-medium);
      border-radius: var(--radius-2xl);
      overflow: hidden;
      box-shadow: var(--shadow-2xl);
    }
    
    .mockup-header {
      background: var(--color-bg-elevated);
      padding: var(--spacing-4);
      display: flex;
      gap: var(--spacing-2);
      border-bottom: 1px solid var(--color-border-subtle);
    }
    
    .mockup-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--color-border-medium);
    }
    
    .mockup-content {
      padding: var(--spacing-6);
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: var(--spacing-6);
    }
    
    .mockup-sidebar-wrapper {
      display: flex;
      flex-direction: column;
      gap: 38px;
      width: 300px;
    }
    
    .mockup-sidebar {
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border-medium);
      border-radius: var(--radius-lg);
      padding: var(--spacing-4);
      height: fit-content;
    }
    
    .sidebar-header {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-4);
      color: var(--color-text-primary);
    }
    
    .cost-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-2) 0;
      font-size: var(--font-size-sm);
    }
    
    .cost-label {
      color: var(--color-text-secondary);
    }
    
    .cost-value {
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
    }
    
    .cost-divider {
      height: 1px;
      background: var(--color-border-subtle);
      margin: var(--spacing-3) 0;
    }
    
    .cost-total {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      padding-top: var(--spacing-2);
    }
    
    .cost-total .cost-value {
      color: var(--color-brand-primary);
    }
    
    .mockup-day {
      border-left: 3px solid var(--color-brand-primary);
      padding-left: var(--spacing-4);
    }
    
    .mockup-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-tertiary);
      margin-bottom: var(--spacing-3);
    }
    
    .mockup-item {
      background: var(--color-bg-elevated);
      border-radius: var(--radius-lg);
      padding: var(--spacing-4);
      margin-bottom: var(--spacing-3);
      border-left: 4px solid;
    }
    
    .mockup-item.purple-item {
      border-left-color: var(--color-timeline-travel);
    }
    
    .mockup-item.blue-item {
      border-left-color: var(--color-timeline-hotel);
    }
    
    .mockup-item.green-item {
      border-left-color: var(--color-timeline-activity);
    }
    
    .item-badge {
      display: inline-block;
      font-size: var(--font-size-xs);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      background: var(--glass-bg);
      margin-bottom: var(--spacing-2);
    }
    
    .item-title {
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-1);
    }
    
    .item-time {
      font-size: var(--font-size-sm);
      color: var(--color-text-tertiary);
    }
    
    /* Activity Search and Recommendations */
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
      cursor: pointer;
    }
    
    .activity-card:hover {
      border-color: var(--color-brand-primary);
      transform: translateX(4px);
      box-shadow: var(--shadow-md);
    }
    
    .activity-image {
      font-size: 48px;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--glass-bg);
      border-radius: var(--radius-md);
      flex-shrink: 0;
    }
    
    .activity-info {
      flex: 1;
      min-width: 0;
    }
    
    .activity-name {
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      margin-bottom: var(--spacing-1);
    }
    
    .activity-meta {
      display: flex;
      gap: var(--spacing-3);
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      margin-bottom: var(--spacing-1);
    }
    
    .activity-price {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-brand-primary);
    }

    /* Trust Section */
    .trust-section {
      padding: var(--spacing-24) 0;
      background: var(--color-bg-secondary);
    }
    
    .trust-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-8);
      margin-bottom: var(--spacing-16);
      text-align: center;
    }
    
    .trust-item {
      text-align: center;
    }
    
    .trust-number {
      font-size: var(--font-size-5xl);
      font-weight: var(--font-weight-extrabold);
      background: var(--color-brand-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--spacing-2);
    }
    
    .trust-label {
      color: var(--color-text-secondary);
      font-size: var(--font-size-base);
    }
    
    .testimonials {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-6);
    }
    
    .testimonial-card {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      padding: var(--spacing-6);
    }
    
    .testimonial-stars {
      color: var(--color-brand-primary);
      font-size: var(--font-size-lg);
      margin-bottom: var(--spacing-3);
    }
    
    .testimonial-text {
      line-height: 1.6;
      margin-bottom: var(--spacing-4);
      font-style: italic;
    }
    
    .testimonial-author {
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
    }

    /* CTA Section */
    .cta-section {
      padding: var(--spacing-24) 0;
      background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
      position: relative;
      overflow: hidden;
    }
    
    .cta-section::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, var(--color-brand-glow) 0%, transparent 70%);
      opacity: 0.3;
      animation: pulse 4s ease-in-out infinite;
    }
    
    .cta-title {
      font-size: var(--font-size-4xl);
      margin-bottom: var(--spacing-4);
      position: relative;
    }
    
    .cta-subtitle {
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-8);
      position: relative;
    }

    /* Footer */
    .footer {
      background: var(--color-bg-secondary);
      border-top: 1px solid var(--color-border-subtle);
      padding: var(--spacing-16) 0 var(--spacing-8);
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: var(--spacing-12);
      margin-bottom: var(--spacing-12);
    }
    
    .footer-brand .logo-text {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      background: var(--color-brand-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--spacing-2);
    }
    
    .footer-tagline {
      color: var(--color-text-tertiary);
    }
    
    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-8);
    }
    
    .footer-column h4 {
      font-size: var(--font-size-base);
      margin-bottom: var(--spacing-4);
      color: var(--color-text-primary);
    }
    
    .footer-column a {
      display: block;
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
      margin-bottom: var(--spacing-2);
      transition: color var(--transition-fast);
    }
    
    .footer-column a:hover {
      color: var(--color-brand-primary);
    }
    
    .sidebar-recommendations {
      margin-top: var(--spacing-6);
      padding-top: var(--spacing-6);
      border-top: 1px solid var(--color-border-subtle);
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: var(--spacing-8);
      border-top: 1px solid var(--color-border-subtle);
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
    }

    @media (max-width: 768px) {
      .hero {
        height: auto;
        min-height: 100vh;
        padding: var(--spacing-20) 0;
      }
      
      .hero-form-inputs {
        grid-template-columns: 1fr;
      }
      
      .steps-grid {
        grid-template-columns: 1fr;
      }
      
      .mockup-content {
        grid-template-columns: 1fr;
      }
      
      .mockup-sidebar {
        order: -1;
      }
      
      .trust-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .footer-links {
        grid-template-columns: 1fr;
      }
    }
    </style>
`;

export function setupLandingPage() {
  // Update navbar with current user state
  const currentUser = getCurrentUser();
  updateNavbar(currentUser);

  // Smooth scroll functionality
  window.scrollToSection = function (sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Hero background rotation - Clear any existing interval first!
  if (window.heroBackgroundInterval) {
    clearInterval(window.heroBackgroundInterval);
  }

  const heroBackgrounds = document.querySelectorAll('.hero-bg');
  if (heroBackgrounds.length > 0) {
    let currentBgIndex = 0;

    window.heroBackgroundInterval = setInterval(() => {
      // Remove active class from current
      heroBackgrounds[currentBgIndex].classList.remove('active');

      // Move to next background
      currentBgIndex = (currentBgIndex + 1) % heroBackgrounds.length;

      // Add active class to next
      heroBackgrounds[currentBgIndex].classList.add('active');
    }, 5000); // 5 seconds
  }
}
