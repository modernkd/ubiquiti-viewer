import type { Device } from "../types/device";
import { API_CONFIG } from "../config/api";
import { getErrorMessage, logError } from "../utils/errorUtils";
import { processDeviceResponse } from "../utils/validationUtils";

// What you get back from device service operations
export interface DeviceServiceResult {
  data: Device[] | null; // List of devices if everything went well, or null if there was a problem
  loading: boolean; // Shows if the operation is still running
  error: string | null; // Error details if something went wrong, or null if it worked
}

// Handles getting and storing Ubiquiti device data from the API.
// Uses a singleton setup so everyone gets the same cached data.
// Caches stuff to avoid hitting the API too much and keep things snappy.
export class DeviceService {
  // The one and only instance of this service
  private static instance: DeviceService;
  // Stored device data
  private cache: Device[] | null = null;
  // When we last updated the cache
  private cacheTimestamp: number | null = null;
  // How long to keep cache in milliseconds from API config
  private readonly CACHE_DURATION = API_CONFIG.CACHE_DURATION;

  // Private constructor to keep it singleton
  private constructor() {}

  // Gets the shared instance of the DeviceService.
  // Makes a new one if there isn't one already.
  static getInstance(): DeviceService {
    if (!DeviceService.instance) {
      DeviceService.instance = new DeviceService();
    }
    return DeviceService.instance;
  }

  // Gets device data from the API, using cache when possible.
  // Returns stored data if it's still good, otherwise hits the API fresh.
  // Deals with errors and gives helpful messages.
  async fetchDevices(): Promise<DeviceServiceResult> {
    try {
      // Check cache first
      if (this.isCacheValid()) {
        return {
          data: this.cache,
          loading: false,
          error: null,
        };
      }

      console.log("Making API request to:", API_CONFIG.BASE_URL);
      const response = await fetch(API_CONFIG.BASE_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();

      // Process and validate the response with graceful degradation
      const processedResponse = processDeviceResponse(rawData);

      if (processedResponse.hasValidationErrors) {
        // Log validation errors but continue with processed data
        logError(
          new Error("Device validation errors"),
          "DeviceService.fetchDevices",
          { validationErrors: processedResponse.validationErrors }
        );
      }

      // Cache the validated result
      this.cache = processedResponse.devices;
      this.cacheTimestamp = Date.now();

      return {
        data: processedResponse.devices,
        loading: false,
        error: null,
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      // Log the error with context
      logError(error, "DeviceService.fetchDevices");

      return {
        data: null,
        loading: false,
        error: errorMessage,
      };
    }
  }

  // Checks if the stored cache is still good to use (exists and hasn't expired).
  private isCacheValid(): boolean {
    return (
      this.cache !== null &&
      this.cacheTimestamp !== null &&
      Date.now() - this.cacheTimestamp < this.CACHE_DURATION
    );
  }

  // Wipes the cache, so the next fetchDevices will hit the API fresh.
  clearCache(): void {
    this.cache = null;
    this.cacheTimestamp = null;
  }

  // Gets the stored devices if the cache is still good.
  // Returns null if there's no usable cache.
  getCachedDevices(): Device[] | null {
    return this.isCacheValid() ? this.cache : null;
  }
}

// Export singleton instance for convenient access
export const deviceService = DeviceService.getInstance();
