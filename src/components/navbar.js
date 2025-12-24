import { navigateTo } from '../router.js';
import { signInWithGoogle, signOutUser, getCurrentUser } from '../firebase/auth.js';

export function Navbar() {
  return `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-logo" onclick="navigateTo('/')">
          <img src="/logo-main.png" alt="TrailPlan" class="logo-image" />
        </div>
        
        <div class="navbar-menu">
          <a href="javascript:void(0)" onclick="navigateTo('/')" class="navbar-link">Home</a>
          <a href="javascript:void(0)" onclick="scrollToSection('features')" class="navbar-link">Features</a>
          <a href="javascript:void(0)" onclick="scrollToSection('about')" class="navbar-link">About</a>
        </div>
        
        <div class="navbar-actions" id="navbar-actions">
          <!-- Default buttons - will be updated by Firebase auth -->
          <button class="btn btn-secondary btn-sm" onclick="handleSignIn()">Sign In</button>
          <button class="btn btn-primary btn-sm" onclick="navigateTo('/trip-form')">Start Your Trip</button>
        </div>
        
        <button class="navbar-toggle" onclick="toggleMobileMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  `;
}

// Make updateNavbar globally accessible
window.updateNavbar = updateNavbar;

export function updateNavbar(user) {
  const actionsContainer = document.getElementById('navbar-actions');
  if (!actionsContainer) {
    // Navbar not rendered yet, will be updated when auth state changes
    return;
  }

  if (user) {
    // User is signed in - show user menu
    actionsContainer.innerHTML = `
      <div class="user-menu">
        <button class="user-button" onclick="toggleUserDropdown()">
          <img src="${user.photoURL || '/default-avatar.png'}" alt="${user.displayName}" class="user-avatar" />
          <span class="user-name">${user.displayName || 'User'}</span>
          <span class="dropdown-arrow">▼</span>
        </button>
        <div class="user-dropdown" id="user-dropdown">
          <a href="javascript:void(0)" onclick="navigateTo('/my-trips')" class="dropdown-item">
            My Trips
          </a>
          <button onclick="handleSignOut()" class="dropdown-item">
            Sign Out
          </button>
        </div>
      </div>
    `;
  } else {
    // User is signed out - show sign in button
    actionsContainer.innerHTML = `
      <button class="btn btn-secondary btn-sm" onclick="handleSignIn()">Sign In</button>
      <button class="btn btn-primary btn-sm" onclick="navigateTo('/trip-form')">Start Your Trip</button>
    `;
  }
}

// Global functions
window.handleSignIn = async function () {
  try {
    await signInWithGoogle();
    // updateNavbar will be called by auth state listener
  } catch (error) {
    console.error('Sign in failed:', error);
    alert('Failed to sign in. Please try again.');
  }
};

window.handleSignOut = async function () {
  try {
    await signOutUser();
    navigateTo('/');
  } catch (error) {
    console.error('Sign out failed:', error);
  }
};

window.toggleUserDropdown = function () {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
};

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const userMenu = e.target.closest('.user-menu');
  const dropdown = document.getElementById('user-dropdown');
  if (!userMenu && dropdown) {
    dropdown.classList.remove('active');
  }
});

// Add navbar styles
export const navbarStyles = `
  <style>
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--header-height);
      background: rgba(10, 10, 10, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--color-border-subtle);
      z-index: var(--z-fixed);
      transition: all var(--transition-base);
    }
    
    .navbar-container {
      max-width: var(--max-width-2xl);
      margin: 0 auto;
      height: 100%;
      padding: 0 var(--spacing-6);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-8);
      position: relative;
    }
    
    .navbar-logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      cursor: pointer;
      text-decoration: none;
      color: var(--color-text-primary);
    }
    
    .logo-image {
      height: 65px;
      width: auto;
      object-fit: contain;
      filter: brightness(1.1);
      mix-blend-mode: screen;
    }
    
    .navbar-logo:hover .logo-image {
      filter: brightness(1.3);
    }
    
    .navbar-menu {
      display: flex;
      align-items: center;
      gap: var(--spacing-6);
      flex: 1;
      justify-content: center;
    }

    @media (min-width: 769px) {
      .navbar-menu {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    
    .navbar-link {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      text-decoration: none;
      transition: color var(--transition-fast);
      position: relative;
    }
    
    .navbar-link:hover {
      color: var(--color-brand-primary);
    }
    
    .navbar-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--color-brand-gradient);
      transition: width var(--transition-base);
    }
    
    .navbar-link:hover::after {
      width: 100%;
    }
    
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }
    
    /* User Menu Styles */
    .user-menu {
      position: relative;
    }
    
    .user-button {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      background: transparent;
      border: 1px solid var(--color-border-medium);
      border-radius: var(--radius-lg);
      padding: var(--spacing-2) var(--spacing-3);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    
    .user-button:hover {
      background: var(--color-bg-elevated);
      border-color: var(--color-brand-primary);
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .user-name {
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .dropdown-arrow {
      font-size: 10px;
      color: var(--color-text-tertiary);
      transition: transform var(--transition-fast);
    }
    
    .user-button:hover .dropdown-arrow {
      transform: rotate(180deg);
    }
    
    .user-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-medium);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      min-width: 180px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all var(--transition-fast);
    }
    
    .user-dropdown.active {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .dropdown-item {
      display: block;
      width: 100%;
      padding: var(--spacing-3) var(--spacing-4);
      text-align: left;
      text-decoration: none;
      color: var(--color-text-primary);
      font-size: var(--font-size-sm);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: background var(--transition-fast);
    }
    
    .dropdown-item:hover {
      background: var(--color-bg-elevated);
      color: var(--color-brand-primary);
    }
    
    .dropdown-item:first-child {
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }
    
    .dropdown-item:last-child {
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    }
    
    .navbar-toggle {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: var(--spacing-2);
    }
    
    .navbar-toggle span {
      width: 24px;
      height: 2px;
      background: var(--color-text-primary);
      transition: all var(--transition-base);
    }
    
    @media (max-width: 768px) {
      .navbar-menu {
        position: absolute;
        top: var(--header-height);
        left: 0;
        right: 0;
        background: var(--color-bg-secondary);
        flex-direction: column;
        padding: var(--spacing-6);
        border-bottom: 1px solid var(--color-border-subtle);
        display: none;
      }
      
      .navbar-menu.active {
        display: flex;
      }
      
      .navbar-actions {
        display: none;
      }
      
      .navbar-toggle {
        display: flex;
      }
      
      .user-name {
        display: none;
      }
    }
  </style>
`;

// Mobile menu toggle
window.toggleMobileMenu = function () {
  const menu = document.querySelector('.navbar-menu');
  menu.classList.toggle('active');
};

window.navigateTo = navigateTo;
