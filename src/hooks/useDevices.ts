import { useQuery } from "@tanstack/react-query";
import { type Device } from "../types/device";
import { API_CONFIG } from "../config/api";
import { getErrorMessage, logError } from "../utils/errorUtils";
import { processDeviceResponse } from "../utils/validationUtils";

// Return type for the useDevices hook
interface UseDevicesResult {
  devices: Device[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<unknown>;
}

// Custom hook for fetching and managing Ubiquiti devices data.
// Returns devices, loading state, error, and refetch function.
export const useDevices = (): UseDevicesResult => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
    staleTime: API_CONFIG.CACHE_DURATION,
  });

  return {
    devices: data || null,
    loading: isLoading,
    error: error ? getErrorMessage(error) : null,
    refetch,
  };
};

// Makes an HTTP request to the configured API endpoint and validates the response
async function fetchDevices(): Promise<Device[]> {
  try {
    const response = await fetch(API_CONFIG.BASE_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch devices: ${response.status}`);
    }

    const rawData = await response.json();

    // Process and validate the response with graceful degradation
    const processedResponse = processDeviceResponse(rawData);

    if (processedResponse.hasValidationErrors) {
      // Log validation errors but continue with processed data
      logError(
        new Error("Device validation errors"),
        "useDevices.fetchDevices",
        { validationErrors: processedResponse.validationErrors }
      );
    }

    return processedResponse.devices;
  } catch (error) {
    // Log the error and re-throw for React Query to handle
    logError(error, "useDevices.fetchDevices");
    throw error;
  }
}
