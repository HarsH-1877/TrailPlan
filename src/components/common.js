// Common UI Components

// Button component
export function Button({ text, variant = 'primary', size = 'md', onClick, icon, className = '' }) {
    const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
    const variantClass = variant === 'secondary' ? 'btn-secondary' : variant === 'outline' ? 'btn-outline' : 'btn-primary';

    return `
    <button class="btn ${variantClass} ${sizeClass} ${className}" onclick="${onClick || ''}">
      ${icon ? `<span>${icon}</span>` : ''}
      ${text}
    </button>
  `;
}

// Card component
export function Card({ title, description, image, price, className = '', children }) {
    return `
    <div class="card ${className}">
      ${image ? `<img src="${image}" alt="${title}" class="card-image" />` : ''}
      ${title ? `<h3 class="text-xl font-semibold">${title}</h3>` : ''}
      ${description ? `<p class="text-secondary">${description}</p>` : ''}
      ${price ? `<div class="text-brand font-bold text-xl">${price}</div>` : ''}
      ${children || ''}
    </div>
  `;
}

// Input component
export function Input({ label, type = 'text', placeholder, id, helper, value = '' }) {
    return `
    <div class="form-group">
      ${label ? `<label class="label" for="${id}">${label}</label>` : ''}
      <input 
        type="${type}" 
        id="${id}" 
        class="input" 
        placeholder="${placeholder || ''}"
        value="${value}"
      />
      ${helper ? `<p class="form-helper">${helper}</p>` : ''}
    </div>
  `;
}

// Select component
export function Select({ label, options, id, helper }) {
    return `
    <div class="form-group">
      ${label ? `<label class="label" for="${id}">${label}</label>` : ''}
      <select id="${id}" class="select">
        ${options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
      </select>
      ${helper ? `<p class="form-helper">${helper}</p>` : ''}
    </div>
  `;
}

// Modal component
export function Modal({ id, title, content, footer }) {
    return `
    <div id="${id}" class="modal-backdrop" style="display: none;">
      <div class="modal animate-scaleIn">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="btn-icon" onclick="closeModal('${id}')">✕</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    </div>
  `;
}

// Badge component
export function Badge({ text, variant = 'default' }) {
    const variantClass = variant === 'primary' ? 'badge-primary' : variant === 'success' ? 'badge-success' : variant === 'warning' ? 'badge-warning' : '';
    return `<span class="badge ${variantClass}">${text}</span>`;
}

// Loading spinner
export function Spinner() {
    return `
    <div class="flex items-center justify-center" style="padding: 2rem;">
      <div class="spinner"></div>
    </div>
  `;
}

// Toast notification
export function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slideDown`;
    toast.textContent = message;
    toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border-medium);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-tooltip);
    max-width: 400px;
  `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Modal helpers
window.openModal = function (id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'flex';
    }
};

window.closeModal = function (id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none';
    }
};
