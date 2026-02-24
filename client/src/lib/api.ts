/**
 * Base URL for all API requests.
 * Set VITE_API_URL in your environment (e.g. https://your-backend.onrender.com)
 * when the backend is hosted on a different origin than the frontend.
 * Leave it empty/unset when running locally (requests are proxied by Vite).
 */
export const API_BASE: string = import.meta.env.VITE_API_URL ?? "";
