/**
 * ─────────────────────────────────────────────────────────────
 * CONTACT & ENQUIRY FORM DISPATCH (API, EMAIL, GOOGLE SHEETS & CSV)
 * ─────────────────────────────────────────────────────────────
 */

// Optional: Set your deployed Google Apps Script Web App URL if using Google Sheets
export const GOOGLE_SHEET_WEBHOOK_URL = '';

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const successEl = document.getElementById('contact-success');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (!form) return;

  // Expose global export helper so admins can download all enquiries as CSV
  window.exportCSKEnquiries = function () {
    const raw = localStorage.getItem('csk_contact_submissions') || '[]';
    const items = JSON.parse(raw);
    if (!items.length) {
      alert('No enquiries recorded yet.');
      return;
    }
    const headers = ['Date', 'Name', 'Email', 'Subject', 'Message'];
    const rows = items.map(i => [
      `"${i.dateFormatted || i.timestamp}"`,
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.subject || '').replace(/"/g, '""')}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `csk_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      subject: subject || 'General Club Enquiry',
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
          Submitting Enquiry...
        </span>
      `;
    }

    try {
      // 1. Send to local Serverless API Endpoint (/api/contact)
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('API /api/contact notification notice:', err));

      // 2. Dispatch to FormSubmit Email Relay to info@caymansuperkings.ky
      fetch('https://formsubmit.co/ajax/info@caymansuperkings.ky', {
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

      // 3. Send to Google Sheets Webhook if configured
      if (GOOGLE_SHEET_WEBHOOK_URL && GOOGLE_SHEET_WEBHOOK_URL.startsWith('http')) {
        fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => console.warn('Google Sheet dispatch notice:', err));
      }

      // 4. Save to client storage backup
      const existing = JSON.parse(localStorage.getItem('csk_contact_submissions') || '[]');
      existing.unshift(payload);
      localStorage.setItem('csk_contact_submissions', JSON.stringify(existing));

      // 5. Show Success State
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
