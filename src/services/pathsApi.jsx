import { fetchJson } from "../shared/lib/fetchJson";

// Base URL from Vite environment
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * POST /route/shortest
 * Request shortest path between two station codes
 */
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
