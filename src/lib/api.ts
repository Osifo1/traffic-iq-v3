const BASE_URL = "https://trafficiq-v2-backend.onrender.com";

const headers = { "Content-Type": "application/json" };

export async function fetchStats() {
  console.log("Fetching from V2 API...");
  const res = await fetch(`${BASE_URL}/stats`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
  const data = await res.json();
  console.log("Stats:", data);
  return data;
}

export async function fetchPlates(camera?: string) {
  const url = camera
    ? `${BASE_URL}/plates?camera=${encodeURIComponent(camera)}&limit=100`
    : `${BASE_URL}/plates?limit=100`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch plates: ${res.status}`);
  return res.json();
}

export async function fetchVehicles(camera?: string) {
  const url = camera
    ? `${BASE_URL}/vehicles?camera=${encodeURIComponent(camera)}&limit=100`
    : `${BASE_URL}/vehicles?limit=100`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch vehicles: ${res.status}`);
  return res.json();
}

export async function fetchIncidents(status?: string, camera?: string, incident_type?: string) {
  let url = `${BASE_URL}/incidents?limit=100`;
  if (status) url += `&status=${encodeURIComponent(status)}`;
  if (camera) url += `&camera=${encodeURIComponent(camera)}`;
  if (incident_type) url += `&incident_type=${encodeURIComponent(incident_type)}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch incidents: ${res.status}`);
  return res.json();
}

export async function updateIncident(id: number, status: string, notes?: string) {
  let url = `${BASE_URL}/incidents/${id}?status=${encodeURIComponent(status)}`;
  if (notes) url += `&notes=${encodeURIComponent(notes)}`;
  const res = await fetch(url, { method: "PATCH", headers });
  if (!res.ok) throw new Error(`Failed to update incident: ${res.status}`);
  return res.json();
}

export async function fetchWatchlist() {
  const res = await fetch(`${BASE_URL}/watchlist`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch watchlist: ${res.status}`);
  return res.json();
}

export async function addToWatchlist(plate_text: string, reason: string, added_by: string) {
  const res = await fetch(`${BASE_URL}/watchlist`, {
    method: "POST",
    headers,
    body: JSON.stringify({ plate_text, reason, added_by }),
  });
  if (!res.ok) throw new Error(`Failed to add to watchlist: ${res.status}`);
  return res.json();
}

export async function removeFromWatchlist(plate_text: string) {
  const res = await fetch(`${BASE_URL}/watchlist/${encodeURIComponent(plate_text)}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error(`Failed to remove from watchlist: ${res.status}`);
  return res.json();
}

export async function fetchOffenders(limit = 10) {
  const res = await fetch(`${BASE_URL}/offenders?limit=${limit}`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch offenders: ${res.status}`);
  return res.json();
}