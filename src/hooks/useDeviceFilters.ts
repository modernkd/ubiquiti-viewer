import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Device } from "../types/device";
import { useDeviceSearch } from "./useDeviceSearch";

// Hook for managing device filtering state synchronized with URL parameters.
// Centralizes logic for parsing URL params, building URLs, and applying filters.
export const useDeviceFilters = (devices: Device[] | null) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse URL params for search and filters - keeps state in sync with browser navigation
  const query = searchParams.get("q") || "";
  const productLineFilter = useMemo(
    () => searchParams.get("lines")?.split(",").filter(Boolean) || [],
    [searchParams]
  );

  // Build URL params string for Ubiquiti device filtering
  const buildUrlParams = (searchQuery: string, lineFilters: string[]) => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (lineFilters.length > 0) params.set("lines", lineFilters.join(","));
    return params;
  };

  // Update browser URL when filters change
  const updateUrl = (newQuery: string, newFilters: string[]) => {
    setSearchParams(buildUrlParams(newQuery, newFilters), { replace: true });
  };

  const setQuery = (newQuery: string) => {
    updateUrl(newQuery, productLineFilter);
  };

  const setProductLineFilter = (newFilters: string[]) => {
    updateUrl(query, newFilters);
  };

  // Filter devices by search query first, then by product line
  const searchFiltered = useDeviceSearch(devices || [], query);
  const productLineFilterFn = useMemo(
    () => (device: Device) =>
      device.line?.name && productLineFilter.includes(device.line.name),
    [productLineFilter]
  );
  const fullyFilteredDevices = useMemo(() => {
    if (productLineFilter.length === 0) return searchFiltered;
    return searchFiltered.filter(productLineFilterFn);
  }, [productLineFilter.length, searchFiltered, productLineFilterFn]);

  // Helper function to build search params string
  const buildSearchParams = () =>
    buildUrlParams(query, productLineFilter).toString();

  return {
    query,
    productLineFilter,
    fullyFilteredDevices,
    setQuery,
    setProductLineFilter,
    buildSearchParams,
  };
};
