// MyNeta Shared Utilities
// Reusable utility functions for the admin dashboard

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Show a loading spinner on an element
 * @param {string} elementId - The ID of the element to show spinner on
 */
function showLoadingSpinner(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Store original content
    element.dataset.originalContent = element.innerHTML;

    element.innerHTML = `
        <tr>
            <td colspan="10" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted mb-0">Loading data...</p>
            </td>
        </tr>
    `;
}

/**
 * Hide the loading spinner and restore content or show new content
 * @param {string} elementId - The ID of the element
 * @param {string} newContent - Optional new content to show
 */
function hideLoadingSpinner(elementId, newContent = null) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (newContent !== null) {
        element.innerHTML = newContent;
    } else if (element.dataset.originalContent) {
        element.innerHTML = element.dataset.originalContent;
        delete element.dataset.originalContent;
    }
}

/**
 * Show empty state message
 * @param {string} message - The message to display
 * @param {string} icon - Font Awesome icon class (default: fa-inbox)
 * @param {number} colspan - Number of columns to span
 * @returns {string} - HTML for empty state
 */
function emptyStateHtml(message, icon = 'fa-inbox', colspan = 6) {
    return `
        <tr>
            <td colspan="${colspan}" class="text-center py-5">
                <div class="text-muted">
                    <i class="fas ${icon} fa-3x mb-3"></i>
                    <p class="mb-0">${escapeHtml(message)}</p>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Show confirmation modal
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Confirm button text
 * @param {string} confirmClass - Confirm button class (btn-danger, btn-primary, etc.)
 * @returns {Promise<boolean>} - Resolves to true if confirmed, false otherwise
 */
function showConfirmModal(title, message, confirmText = 'Confirm', confirmClass = 'btn-danger') {
    return new Promise((resolve) => {
        // Check if modal already exists
        let modal = document.getElementById('confirmModal');
        if (!modal) {
            // Create modal HTML
            const modalHtml = `
                <div class="modal fade" id="confirmModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="confirmModalTitle"></h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p id="confirmModalMessage" class="mb-0"></p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="confirmModalCancel">Cancel</button>
                                <button type="button" class="btn" id="confirmModalConfirm"></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            modal = document.getElementById('confirmModal');
        }

        // Set modal content
        document.getElementById('confirmModalTitle').textContent = title;
        document.getElementById('confirmModalMessage').textContent = message;
        const confirmBtn = document.getElementById('confirmModalConfirm');
        confirmBtn.textContent = confirmText;
        confirmBtn.className = `btn ${confirmClass}`;

        const bsModal = new bootstrap.Modal(modal);

        // Handle confirm
        const handleConfirm = () => {
            cleanup();
            bsModal.hide();
            resolve(true);
        };

        // Handle cancel/close
        const handleCancel = () => {
            cleanup();
            resolve(false);
        };

        // Cleanup event listeners
        const cleanup = () => {
            confirmBtn.removeEventListener('click', handleConfirm);
            modal.removeEventListener('hidden.bs.modal', handleCancel);
        };

        confirmBtn.addEventListener('click', handleConfirm);
        modal.addEventListener('hidden.bs.modal', handleCancel);

        bsModal.show();
    });
}

/**
 * Validate a form and show visual feedback
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateForm(form) {
    if (!form) return false;

    // Remove previous validation states
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

    let isValid = true;

    // Check required fields
    form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        }
    });

    // Check email fields
    form.querySelectorAll('[type="email"]').forEach(field => {
        if (field.value && !field.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            field.classList.add('is-invalid');
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Debounce a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for use in modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { escapeHtml, showLoadingSpinner, hideLoadingSpinner, emptyStateHtml, showConfirmModal, validateForm, debounce };
}
