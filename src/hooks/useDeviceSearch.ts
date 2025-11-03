import { useMemo } from "react";
import type { Device } from "../types/device";
import { filterDevices } from "../utils/deviceFilters";
import { sanitizeSearchQuery } from "../utils/securityUtils";

/**
 * Custom hook for filtering devices based on a search query.
 *
 * Uses React's useMemo to optimize performance by only recalculating the filtered
 * results when the devices array or search query changes. Delegates the actual
 * filtering logic to the filterDevices utility function.
 *
 * @param {Device[]} devices - Array of devices to filter.
 * @param {string} query - Search query string to filter devices by.
 * @returns {Device[]} Array of devices that match the search query.
 *
 * @example
 * ```tsx
 * import { useDeviceSearch } from './hooks/useDeviceSearch';
 *
 * function SearchableDeviceList({ devices }: { devices: Device[] }) {
 *   const [query, setQuery] = useState('');
 *   const filteredDevices = useDeviceSearch(devices, query);
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         value={query}
 *         onChange={(e) => setQuery(e.target.value)}
 *         placeholder="Search devices..."
 *       />
 *       <ul>
 *         {filteredDevices.map(device => (
 *           <li key={device.id}>{device.product.name}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export const useDeviceSearch = (devices: Device[], query: string): Device[] => {
  return useMemo(() => {
    const sanitizedQuery = sanitizeSearchQuery(query);
    return filterDevices(devices, sanitizedQuery);
  }, [devices, query]);
};
