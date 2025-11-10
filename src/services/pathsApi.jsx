import { fetchJson } from "../shared/lib/fetchJson";

// Base URL from Vite environment
const API_BASE = import.meta.env.VITE_API_BASE_URL;


// POST /route/shortest
// Request shortest path between two station codes
export async function fetchShortestPath(fromCode, toCode) {
  const url = `${API_BASE}/paths/shortest`;

  const payload = {
    from_station_code: fromCode,
    to_station_code: toCode,
  };

  const result = await fetchJson(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result; // returns { ok, data, error }
}


// POST /paths/longest
// Request longest path between two station codes
export async function fetchAllPaths(fromCode, toCode) {
  const url = `${API_BASE}/paths/all_paths`;

  const payload = {
    from_station_code: fromCode,
    to_station_code: toCode,
  };

  const result = await fetchJson(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result; 
}

// POST /paths/cheapest
// Request cheapest path between two station codes
export async function fetchCheapestPath(fromCode, toCode) {
  const url = `${API_BASE}/paths/cheapest`;

  const payload = {
    from_station_code: fromCode,
    to_station_code: toCode,
  };

  const result = await fetchJson(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result; 
}

// POST /paths/fare
// Request cheapest path between two station codes
export async function fetchFarePath(fromCode, toCode) {
  const url = `${API_BASE}/paths/fare`;

  const payload = {
    from_station_code: fromCode,
    to_station_code: toCode,
  };

  const result = await fetchJson(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result; 
}