/**
 * Configuration object for API-related settings.
 *
 * Contains constants for API endpoints and caching behavior used throughout
 * the application for fetching Ubiquiti device data.
 *
 * @constant
 * @type {Readonly<{BASE_URL: string, CACHE_DURATION: number}>}
 *
 * @property {string} BASE_URL - The URL endpoint for fetching Ubiquiti device data.
 * @property {number} CACHE_DURATION - Cache duration in milliseconds (5 minutes).
 *
 * @example
 * ```ts
 * import { API_CONFIG } from './config/api';
 *
 * // Use in API calls
 * const response = await fetch(API_CONFIG.BASE_URL);
 *
 * // Use for caching
 * const staleTime = API_CONFIG.CACHE_DURATION;
 * ```
 */
export const API_CONFIG = {
  BASE_URL: "https://static.ui.com/fingerprint/ui/public.json",
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const;
