import React from "react";
import { SearchBar } from "./SearchBar";
import { ViewToggle } from "./ViewToggle";
import { DeviceFilters } from "./devicelist/DeviceFilters";
import type { Device } from "../types/device";
import styles from "../App.module.css";

/**
 * Props for the DeviceToolbar component.
 */
interface DeviceToolbarProps {
  /**
   * Current global search filter value.
   */
  globalFilter: string;
  /**
   * Callback to update the global search filter.
   */
  setGlobalFilter: (value: string) => void;
  /**
   * Current view mode (grid or list).
   */
  viewMode: "grid" | "list";
  /**
   * Callback to change the view mode.
   */
  setViewMode: (mode: "grid" | "list") => void;
  /**
   * Total number of devices being displayed.
   */
  totalDevices: number;
  /**
   * Current product line filter values (array for multi-select).
   */
  productLineFilter: string[];
  /**
   * Callback to update the product line filter.
   */
  setProductLineFilter: (value: string[]) => void;
  /**
   * Array of devices to extract product lines from.
   */
  devices: Device[];
}

/**
 * DeviceToolbar component providing search, filtering, and view controls for device listings.
 *
 * This toolbar component includes:
 * - Search bar for global device filtering
 * - Device count display
 * - Product line filter dropdown
 * - View mode toggle (grid/list)
 *
 * The toolbar is split into left and right sections for optimal layout.
 *
 * @param props - The component props
 * @param props.globalFilter - Current search filter value
 * @param props.setGlobalFilter - Function to update search filter
 * @param props.viewMode - Current view mode
 * @param props.setViewMode - Function to change view mode
 * @param props.totalDevices - Number of devices shown
 * @param props.productLineFilter - Current product line filter
 * @param props.setProductLineFilter - Function to update product line filter
 * @param props.uniqueProductLines - Available product lines for filtering
 *
 * @example
 * ```tsx
 * <DeviceToolbar
 *   globalFilter={searchTerm}
 *   setGlobalFilter={setSearchTerm}
 *   viewMode="grid"
 *   setViewMode={setViewMode}
 *   totalDevices={devices.length}
 *   productLineFilter={selectedLine}
 *   setProductLineFilter={setSelectedLine}
 *   uniqueProductLines={productLines}
 * />
 * ```
 */
export const DeviceToolbar: React.FC<DeviceToolbarProps> = ({
  globalFilter,
  setGlobalFilter,
  viewMode,
  setViewMode,
  totalDevices,
  productLineFilter,
  setProductLineFilter,
  devices,
}) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarLeft}>
        <SearchBar
          value={globalFilter}
          onChange={setGlobalFilter}
          devices={devices}
        />
        <span className={styles.deviceCount}>
          {totalDevices} device{totalDevices !== 1 ? "s" : ""}
        </span>
      </div>
      <div className={styles.toolbarRight}>
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        <DeviceFilters
          devices={devices}
          selectedFilters={productLineFilter}
          onFiltersChange={setProductLineFilter}
        />
      </div>
    </div>
  );
};
