// Enquiry store for the serverless API.
// Submissions are kept in memory and in /tmp for the life of the server
// instance only; the permanent record is the club's Google Sheet, which
// /api/contact forwards every submission to. Nothing is written into the
// deployed site folder, so enquiries can never be downloaded as a file.
import fs from 'fs';
import path from 'path';

const TMP_CACHE_FILE = path.join('/tmp', 'csk_enquiries.json');

function loadCache() {
  try {
    if (fs.existsSync(TMP_CACHE_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(TMP_CACHE_FILE, 'utf8'));
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) { /* ignore */ }
  return [];
}

const liveSubmissions = loadCache();

export function addSubmission(sub) {
  liveSubmissions.unshift(sub);
  if (liveSubmissions.length > 500) liveSubmissions.length = 500;
  try {
    fs.writeFileSync(TMP_CACHE_FILE, JSON.stringify(liveSubmissions), { encoding: 'utf8', mode: 0o600 });
  } catch (_) { /* read-only environment */ }
  return liveSubmissions;
}

export function getSubmissions() {
  return liveSubmissions;
}
