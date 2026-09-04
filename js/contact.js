/**
 * ─────────────────────────────────────────────────────────────
 * CONTACT FORM & VALIDATION MODULE
 * ─────────────────────────────────────────────────────────────
 */

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const successState = document.getElementById('contact-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    let isValid = true;

    // Name Validation
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your full name');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Subject Validation
    if (!subjectInput.value) {
      showError(subjectInput, 'Please select an enquiry subject');
      isValid = false;
    } else {
      clearError(subjectInput);
    }

    // Message Validation
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, 'Please enter a message with at least 10 characters');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      // Simulate successful submission
      form.style.display = 'none';
      if (successState) {
        successState.classList.add('is-visible');
        successState.focus();
      }
    }
  });

  function showError(input, msg) {
    input.classList.add('error');
    let errorEl = input.parentElement.querySelector('.form-error-msg');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error-msg';
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = msg;
  }

  function clearError(input) {
    input.classList.remove('error');
    const errorEl = input.parentElement.querySelector('.form-error-msg');
    if (errorEl) {
      errorEl.textContent = '';
    }
  }
}
