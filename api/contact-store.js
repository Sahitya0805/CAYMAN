// Backend Private Submissions Store (In-Memory & Serverless Cache)
import fs from 'fs';
import path from 'path';

const TMP_CACHE_FILE = '/tmp/csk_enquiries_store.json';

function loadPersisted() {
  try {
    if (fs.existsSync(TMP_CACHE_FILE)) {
      const data = fs.readFileSync(TMP_CACHE_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    // ignore read error
  }
  return [];
}

const liveSubmissions = loadPersisted();

export function addSubmission(sub) {
  liveSubmissions.unshift(sub);
  try {
    fs.writeFileSync(TMP_CACHE_FILE, JSON.stringify(liveSubmissions, null, 2), 'utf8');
  } catch (err) {
    // ignore write error in restricted runtime
  }
  return liveSubmissions;
}

export function getSubmissions() {
  if (liveSubmissions.length === 0) {
    const fromDisk = loadPersisted();
    if (fromDisk.length > 0) {
      liveSubmissions.push(...fromDisk);
    }
  }
  return liveSubmissions;
}
