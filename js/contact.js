/**
 * ─────────────────────────────────────────────────────────────
 * CONTACT & ENQUIRY FORM DISPATCH (API, EMAIL, GOOGLE SHEETS & CSV)
 * ─────────────────────────────────────────────────────────────
 */

// Optional: Set your deployed Google Apps Script Web App URL if using Google Sheets
export const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyAqCeY78kegRajbkM4iWDKnDcM4FB_UJNGyoa_0_oTH1RCGsJLU9kySAMzR1nmfzKOOg/exec';

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const successEl = document.getElementById('contact-success');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('contact-name-error');
  const emailError = document.getElementById('contact-email-error');
  const subjectError = document.getElementById('contact-subject-error');
  const messageError = document.getElementById('contact-message-error');

  function validateName() {
    if (!nameInput) return true;
    const val = nameInput.value.trim();
    const isValid = val.length >= 2;
    if (nameError) nameError.style.display = isValid ? 'none' : 'block';
    nameInput.style.borderColor = isValid ? '#CBD5E1' : '#DC2626';
    return isValid;
  }

  function validateEmail() {
    if (!emailInput) return true;
    const val = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(val);
    if (emailError) emailError.style.display = isValid ? 'none' : 'block';
    emailInput.style.borderColor = isValid ? '#CBD5E1' : '#DC2626';
    return isValid;
  }

  function validateSubject() {
    if (!subjectInput) return true;
    const val = subjectInput.value.trim();
    const isValid = val !== '';
    if (subjectError) subjectError.style.display = isValid ? 'none' : 'block';
    subjectInput.style.borderColor = isValid ? '#CBD5E1' : '#DC2626';
    return isValid;
  }

  function validateMessage() {
    if (!messageInput) return true;
    const val = messageInput.value.trim();
    const isValid = val.length >= 10;
    if (messageError) messageError.style.display = isValid ? 'none' : 'block';
    messageInput.style.borderColor = isValid ? '#CBD5E1' : '#DC2626';
    return isValid;
  }

  // Real-time live validations
  if (nameInput) {
    nameInput.addEventListener('input', () => { if (nameError && nameError.style.display === 'block') validateName(); });
    nameInput.addEventListener('blur', validateName);
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => { if (emailError && emailError.style.display === 'block') validateEmail(); });
    emailInput.addEventListener('blur', validateEmail);
  }
  if (subjectInput) {
    subjectInput.addEventListener('change', validateSubject);
    subjectInput.addEventListener('blur', validateSubject);
  }
  if (messageInput) {
    messageInput.addEventListener('input', () => { if (messageError && messageError.style.display === 'block') validateMessage(); });
    messageInput.addEventListener('blur', validateMessage);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
      if (!isNameValid && nameInput) nameInput.focus();
      else if (!isEmailValid && emailInput) emailInput.focus();
      else if (!isSubjectValid && subjectInput) subjectInput.focus();
      else if (!isMessageValid && messageInput) messageInput.focus();
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    const payload = {
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString('en-US', { timeZone: 'America/Cayman' }),
      name: name,
      email: email,
      subject: subject || 'General Club Enquiry',
      message: message
    };

    // Save to local storage for persistence & review
    try {
      const existing = JSON.parse(localStorage.getItem('csk_enquiries') || '[]');
      existing.unshift(payload);
      localStorage.setItem('csk_enquiries', JSON.stringify(existing.slice(0, 50)));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    // UI Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 8px;">
          <svg class="spin-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          Submitting Enquiry...
        </span>
      `;
    }

    try {
      // 1. Send to local Serverless API Endpoint (/api/contact) which forwards to Google Sheets
      let apiHandled = false;
      try {
        const apiRes = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (apiRes.ok) {
          apiHandled = true;
        }
      } catch (err) {
        console.warn('API /api/contact notification notice:', err);
      }

      // 2. Dispatch to FormSubmit Email Relay to caymansuperkings@gmail.com
      fetch('https://formsubmit.co/ajax/caymansuperkings@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[CSK Enquiry] ${payload.subject} from ${payload.name}`,
          _template: 'table',
          _captcha: 'false',
          Date: payload.dateFormatted,
          Name: payload.name,
          Email: payload.email,
          Subject: payload.subject,
          Message: payload.message
        })
      }).catch(err => console.warn('Email dispatch relay notice:', err));

      // 3. Fallback direct dispatch to Google Sheets Webhook if serverless API didn't handle it
      if (!apiHandled && GOOGLE_SHEET_WEBHOOK_URL && GOOGLE_SHEET_WEBHOOK_URL.startsWith('http')) {
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        }).catch(err => console.warn('Google Sheet dispatch notice:', err));
      }

      // 4. Show Success State
      form.style.display = 'none';
      if (successEl) {
        successEl.style.display = 'block';
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err) {
      console.error('Error handling contact submission:', err);
      form.style.display = 'none';
      if (successEl) {
        successEl.style.display = 'block';
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>SUBMIT MESSAGE →</span>`;
      }
    }
  });
}
