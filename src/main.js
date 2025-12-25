import './style.css';
import { router } from './router.js';
import { LandingPage, setupLandingPage } from './pages/landing.js';
import { TripFormPage, setupTripForm } from './pages/trip-form.js';
import { TimelinePage } from './pages/timeline.js';
import { MyTripsPage, setupMyTripsPage } from './pages/my-trips.js';
import { onAuthChange, getCachedAuthState, getCurrentUser } from './firebase/auth.js';
import { updateNavbar } from './components/navbar.js';
import './utils/save-trip.js'; // Initialize save trip functionality

// Register routes
router.addRoute('/', LandingPage);
router.addRoute('/trip-form', TripFormPage);
router.addRoute('/timeline', TimelinePage);
router.addRoute('/my-trips', MyTripsPage);

// Make navigateTo global
window.navigateTo = (path) => router.navigate(path);

// Use cached auth state for immediate update (prevents logged-out appearance)
const cachedAuth = getCachedAuthState();
if (cachedAuth) {
    updateNavbar({ displayName: cachedAuth.displayName, photoURL: cachedAuth.photoURL });
}

// Listen to auth state changes (will update with real Firebase state)
onAuthChange((user) => {
    console.log('Auth state changed:', user ? user.displayName : 'Not signed in');
    updateNavbar(user);
});

// Set up afterRender to attach event listeners
router.setAfterRender((path) => {
    console.log('Route changed to:', path);

    if (path === '/') {
        setupLandingPage();
    }

    // Trip form page - attach all event listeners after DOM is ready
    if (path === '/trip-form') {
        console.log('Setting up trip form...');
        // Update navbar immediately
        const currentUser = getCurrentUser();
        updateNavbar(currentUser);

        // Always setup trip form when navigating to this page
        setTimeout(() => {
            console.log('Calling setupTripForm() now...');
            setupTripForm();
        }, 100);
    }

    // My Trips page
    if (path === '/my-trips') {
        setTimeout(() => {
            setupMyTripsPage();
        }, 100);
    }
});

// Initialize router AFTER setting up afterRender callback
router.handleRoute();


// Global PDF Export Function (for timeline page)
window.exportPDF = async function () {
    const button = event.target;
    const originalText = button.innerHTML;

    try {
        // Console checks (MANDATORY)
        console.log('PDF click fired');
        console.log('html2canvas:', window.html2canvas);
        console.log('jsPDF:', window.jspdf);

        // Show loading state
        button.disabled = true;
        button.innerHTML = '⏳ Generating PDF...';

        // Use global objects (NO dynamic imports)
        const html2canvas = window.html2canvas;
        const { jsPDF } = window.jspdf;

        if (!html2canvas || !jsPDF) {
            throw new Error('PDF libraries not loaded');
        }

        // Get the timeline export container
        const exportContainer = document.getElementById('timeline-export');
        if (!exportContainer) {
            throw new Error('Timeline export container not found');
        }

        console.log('📄 Starting PDF generation...');

        // Capture DOM as canvas
        const canvas = await html2canvas(exportContainer, {
            scale: 2,
            useCORS: true,
            allowTaint: true,  // Prevent canvas failure if images lack CORS
            backgroundColor: '#ffffff',
            logging: false
        });

        console.log('✅ Canvas captured');

        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = canvas.width / canvas.height;

        let imgWidth = pdfWidth;
        let imgHeight = pdfWidth / ratio;
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add more pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        // Download
        const tripDataStr = sessionStorage.getItem('tripData');
        let filename = 'TrailPlan-Itinerary.pdf';

        if (tripDataStr) {
            try {
                const tripData = JSON.parse(tripDataStr);
                const tripName = tripData.tripName || tripData.destination || 'Itinerary';
                const sanitized = tripName.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-');
                filename = `${sanitized}.pdf`;
            } catch (e) {
                console.error('Error parsing trip data for filename:', e);
            }
        }

        pdf.save(filename);

        console.log('✅ PDF downloaded');

    } catch (error) {
        console.error('❌ PDF failed:', error);
        alert('Unable to generate PDF. Please try again.');
    } finally {
        button.disabled = false;
        button.innerHTML = originalText;
    }
};

// Log app start
console.log('Trail Plan initialized ✈️');

// Global loading functions for itinerary generation
window.showLoading = function () {
    let overlay = document.getElementById('itinerary-loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'itinerary-loading-overlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"><\/script>
            <dotlottie-player 
              src="/loading.lottie" 
              background="transparent" 
              speed="1" 
              style="width: 300px; height: 300px;" 
              loop 
              autoplay>
            </dotlottie-player>
        `;
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
};

window.hideLoading = function () {
    const overlay = document.getElementById('itinerary-loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
};

// Hide loading screen once page is ready
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 500); // Show for at least 500ms
    }
});

