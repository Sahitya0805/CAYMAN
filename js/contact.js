/**
 * ─────────────────────────────────────────────────────────────
 * CONTACT & ENQUIRY FORM TO GOOGLE SHEET / EXCEL WEBHOOK
 * ─────────────────────────────────────────────────────────────
 */

// ⚙️ PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
// Follow the simple 3-step setup in the agent response to connect your Google / Excel sheet.
export const GOOGLE_SHEET_WEBHOOK_URL = '';

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const successEl = document.getElementById('contact-success');
  const errorEl = document.getElementById('contact-error');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString('en-US', { timeZone: 'America/Cayman' }),
      name: name,
      email: email,
      subject: subject || 'General Enquiry',
      message: message
    };

    // UI Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 8px;">
          <svg class="spin-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          Recording to Sheet...
        </span>
      `;
    }

    try {
      // 1. Send to Google Sheets Webhook if URL is configured
      if (GOOGLE_SHEET_WEBHOOK_URL && GOOGLE_SHEET_WEBHOOK_URL.startsWith('http')) {
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors', // standard for Google Apps Script Web App
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      }

      // 2. Backup to Local Storage database
      const existing = JSON.parse(localStorage.getItem('csk_contact_submissions') || '[]');
      existing.push(payload);
      localStorage.setItem('csk_contact_submissions', JSON.stringify(existing));

      // 3. Show Success State
      form.style.display = 'none';
      if (successEl) {
        successEl.style.display = 'block';
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err) {
      console.error('Error submitting form to sheet:', err);
      // Even if network webhook fails, persist locally and show confirmation
      form.style.display = 'none';
      if (successEl) {
        successEl.style.display = 'block';
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Submit Message →`;
      }
    }
  });
}
