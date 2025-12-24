// Router for SPA navigation
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    // Register a route
    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    // Navigate to a route
    navigate(path) {
        window.location.hash = path;
    }

    // Handle route changes
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const route = this.routes[hash] || this.routes['/'];

        if (route) {
            // Clear current page
            const app = document.getElementById('app');
            app.innerHTML = '';

            // Render new page
            this.currentPage = route();
            app.innerHTML = this.currentPage;

            // Trigger animations
            this.animatePageLoad();

            // Call afterRender callback if exists
            if (this.afterRender) {
                setTimeout(() => this.afterRender(hash), 100);
            }
        }
    }

    // Set callback to run after route changes
    setAfterRender(callback) {
        this.afterRender = callback;
    }

    // Add page load animations
    animatePageLoad() {
        const elements = document.querySelectorAll('.animate-on-load');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-slideUp');
            }, index * 100);
        });
    }
}

// Create global router instance
export const router = new Router();

// Navigation helper
export function navigateTo(path) {
    router.navigate(path);
}
