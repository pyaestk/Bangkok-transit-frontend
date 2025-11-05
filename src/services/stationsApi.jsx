// import { fetchJson } from "../shared/lib/fetchJson";

// // Base API URL from Vite environment
// const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/stations`;

// // ---- API Functions ----

// // Fetch all stations
// export async function fetchStations() {
//   return await fetchJson(`${API_BASE}/`);
// }


// services/stationsApi.jsx
// Small, self-contained helper that talks to FastAPI.
// Reads VITE_API_URL from your .env (e.g., http://localhost:8000)

// const API_BASE =
//   (import.meta.env?.VITE_API_URL || "http://localhost:7001").replace(/\/$/, "");

// async function http(path, { method = "GET", params, body } = {}) {
//   let url = `${API_BASE}${path}`;
//   if (params && Object.keys(params).length) {
//     const q = new URLSearchParams(params);
//     url += `?${q.toString()}`;
//   }

//   const res = await fetch(url, {
//     method,
//     headers: body ? { "Content-Type": "application/json" } : undefined,
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   const isJson = (res.headers.get("content-type") || "").includes("application/json");
//   const data = isJson ? await res.json() : await res.text();

//   if (!res.ok) {
//     const message = (data && (data.detail || data.message || data.error)) || res.statusText;
//     return { ok: false, status: res.status, error: message };
//   }
//   return { ok: true, status: res.status, data };
// }

/**
 * Fetch stations from backend.
 * Supports optional search and line filtering (if backend accepts them).
 */
// export async function fetchStations({ search = "", lineId = "", limit = 0 } = {}) {
//   const params = {};
//   if (search) params.search = search;
//   if (lineId) params.line_id = lineId;
//   if (limit) params.limit = limit;

//   const res = await http("/stations", { params });
//   if (!res.ok) return res;

//   // Normalize shape for the UI
//   const list = Array.isArray(res.data) ? res.data : [];
//   const stations = list.map((s) => ({
//     station_code: s.station_code ?? s.code ?? s.id ?? "",
//     name_en: s.name_en ?? s.name ?? "",
//     name_thai: s.name_thai ?? "",
//     line: s.line ?? null,     // optional: { id, name_en, ... }
//     place: s.place ?? null,   // optional: { id, name_en, ... }
//     x: typeof s.x !== "undefined" ? Number(s.x) : undefined,
//     y: typeof s.y !== "undefined" ? Number(s.y) : undefined,
//   }));

//   return { ok: true, data: stations };
// }
// src/services/stationsApi.jsx
// const API_ROOT = (
//   import.meta.env?.VITE_API_BASE_URL ||
//   import.meta.env?.VITE_API_URL ||
//   "http://localhost:8000"
// ).replace(/\/$/, "");

// const API_BASE = `${API_ROOT}/stations`;

// async function fetchJson(url, { method = "GET", params, body } = {}) {
//   let full = url;
//   if (params && Object.keys(params).length) {
//     const qs = new URLSearchParams(params);
//     full += (full.includes("?") ? "&" : "?") + qs.toString();
//   }
//   const res = await fetch(full, {
//     method,
//     headers: body ? { "Content-Type": "application/json" } : undefined,
//     body: body ? JSON.stringify(body) : undefined,
//   });
//   const isJson = (res.headers.get("content-type") || "").includes("application/json");
//   const data = isJson ? await res.json() : await res.text();
//   if (!res.ok) {
//     const message = (data && (data.detail || data.message || data.error)) || res.statusText;
//     const err = new Error(message);
//     err.status = res.status;
//     err.data = data;
//     throw err;
//   }
//   return data;
// }

// /**
//  * Fetch stations with optional filters.
//  * @param {Object} opts
//  * @param {string} opts.search
//  * @param {string|number} opts.lineId
//  * @param {string} opts.lineName   // NEW: filter by line name text
//  * @param {number} opts.limit
//  */
// export async function fetchStations({ search = "", lineId = "", lineName = "", limit = 0 } = {}) {
//   const params = {};
//   if (search) params.search = search;
//   if (lineId) params.line_id = lineId;
//   if (lineName) params.line_name = lineName; // backend will match name_en LIKE %lineName%
//   if (limit) params.limit = limit;

//   const raw = await fetchJson(`${API_BASE}/`, { params });
//   const arr = Array.isArray(raw) ? raw : [];
//   return arr.map((s) => ({
//     station_code: s.station_code ?? s.code ?? s.id ?? "",
//     name_en: s.name_en ?? s.name ?? "",
//     name_thai: s.name_thai ?? "",
//     line_id: s.line_id ?? null,
//     x: typeof s.x !== "undefined" ? Number(s.x) : undefined,
//     y: typeof s.y !== "undefined" ? Number(s.y) : undefined,
//   }));
// }

// export async function searchStations(term, { limit = 20 } = {}) {
//   return fetchStations({ search: term, limit });
// }


// src/services/stationsApi.jsx
const API_ROOT = (
  import.meta.env?.VITE_API_BASE_URL ||
  import.meta.env?.VITE_API_URL ||
  "http://localhost:7001"
).replace(/\/$/, "");

const API_BASE = `${API_ROOT}/stations`;

// fetch with timeout + consistent {ok,data,error,status}
async function request(url, { method = "GET", params, body, timeoutMs = 12000 } = {}) {
  let full = url;
  if (params && Object.keys(params).length) {
    const qs = new URLSearchParams(params);
    full += (full.includes("?") ? "&" : "?") + qs.toString();
  }

  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort("Request timed out"), timeoutMs);

  try {
    const res = await fetch(full, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });

    const contentType = res.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await res.json() : await res.text();

    if (!res.ok) {
      const message = (payload && (payload.detail || payload.message || payload.error)) || res.statusText;
      return { ok: false, status: res.status, error: message, data: payload };
    }
    return { ok: true, status: res.status, data: payload };
  } catch (err) {
    return { ok: false, status: 0, error: err?.message || String(err) };
  } finally {
    clearTimeout(to);
  }
}

/**
 * Fetch stations with optional filters.
 * Accepts either lineId or lineName (or both). Backend can ignore unknown params.
 */
export async function fetchStations({ search = "", lineId = "", lineName = "", limit = 0 } = {}) {
  const params = {};
  if (search) params.search = search;
  if (lineId) params.line_id = lineId;
  if (lineName) params.line_name = lineName; // works with backend enhancement
  if (limit) params.limit = limit;

  const res = await request(`${API_BASE}/`, { params });
  if (!res.ok) return res;

  const arr = Array.isArray(res.data) ? res.data : [];
  const normalized = arr.map((s) => ({
    station_code: s.station_code ?? s.code ?? s.id ?? "",
    name_en: s.name_en ?? s.name ?? "",
    name_thai: s.name_thai ?? "",
    line_id: s.line_id ?? null,
    x: typeof s.x !== "undefined" ? Number(s.x) : undefined,
    y: typeof s.y !== "undefined" ? Number(s.y) : undefined,
  }));

  return { ok: true, status: res.status, data: normalized };
}
