// Shared Live Submissions In-Memory and Local Store

const liveSubmissions = [
  {
    timestamp: new Date().toISOString(),
    dateFormatted: new Date().toLocaleString('en-US', { timeZone: 'America/Cayman' }),
    name: "Marcus Campbell",
    email: "marcus@example.ky",
    subject: "Corporate Sponsorship & Brand Partnership",
    message: "Looking to discuss CSK corporate jersey sponsorship for the 2026/27 Super League season.",
    status: "In Review"
  }
];

export function addSubmission(sub) {
  liveSubmissions.unshift(sub);
  return liveSubmissions;
}

export function getSubmissions() {
  return liveSubmissions;
}
