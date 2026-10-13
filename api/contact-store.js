// Backend Private Submissions Store (In-Memory, File-Based & Excel Database Sync)
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const TMP_CACHE_FILE = path.join('/tmp', 'csk_enquiries.json');
const CONTENT_FILE = path.join(process.cwd(), 'content', 'enquiries.json');

const DEFAULT_TEST_SUBMISSIONS = [
  {
    timestamp: "2026-10-12T05:30:00.000Z",
    dateFormatted: "10/12/2026, 01:30:00 AM",
    name: "Marcus Campbell",
    email: "marcus.campbell@candw.ky",
    subject: "Youth Academy Registration (Ages 10-16)",
    message: "Enquiring to enroll my 12-year-old in the CSK Junior Cricket Academy weekend training sessions at Smith Road Oval.",
    status: "Verified Test Submission (Website Live Form)"
  },
  {
    timestamp: "2026-10-11T14:15:00.000Z",
    dateFormatted: "10/11/2026, 09:15:00 AM",
    name: "Corporate Partner Sponsor",
    email: "partnerships@caymanbusiness.ky",
    subject: "Corporate League Sponsorship 2026",
    message: "Interested in the 2026 Premier Club Partner package and banner placement at Jimmy Powell Oval.",
    status: "New / Received"
  }
];

function loadPersisted() {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    // ignore
  }

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
  return [...DEFAULT_TEST_SUBMISSIONS];
}

const liveSubmissions = loadPersisted();

export function addSubmission(sub) {
  liveSubmissions.unshift(sub);

  // 1. Persist to /tmp/csk_enquiries.json
  try {
    fs.writeFileSync(TMP_CACHE_FILE, JSON.stringify(liveSubmissions, null, 2), 'utf8');
  } catch (err) {
    // ignore in restricted env
  }

  // 2. Persist to content/enquiries.json
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(liveSubmissions, null, 2), 'utf8');
  } catch (err) {
    // ignore in read-only serverless env
  }

  // 3. Trigger immediate Excel export update
  try {
    const scriptPath = path.join(process.cwd(), 'scripts', 'generate_excel_export.py');
    if (fs.existsSync(scriptPath)) {
      exec(`python3 "${scriptPath}"`, (err) => {
        if (err) {
          // fallback to python command if python3 not available
          exec(`python "${scriptPath}"`, () => {});
        }
      });
    }
  } catch (err) {
    // ignore
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
