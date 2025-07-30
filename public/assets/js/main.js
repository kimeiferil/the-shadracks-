// CSRF Token handling
document.addEventListener('DOMContentLoaded', () => {
  // Get CSRF token for forms
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  
  // Add to all forms automatically
  document.querySelectorAll('form').forEach(form => {
    if (!form.querySelector('input[name="_csrf"]')) {
      const csrfInput = document.createElement('input');
      csrfInput.type = 'hidden';
      csrfInput.name = '_csrf';
      csrfInput.value = csrfToken;
      form.appendChild(csrfInput);
    }
  });

  // Add to AJAX requests
  const originalFetch = window.fetch;
  window.fetch = async (url, options = {}) => {
    options.headers = {
      ...options.headers,
      'CSRF-Token': csrfToken
    };
    return originalFetch(url, options);
  };
});
