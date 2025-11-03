import React, { Suspense, lazy } from "react";
import type { Device } from "../types/device";
import { ErrorBoundary } from "./ErrorBoundary";
import { logBoundaryError } from "../utils/errorUtils";
import { LoadingSpinner } from "./LoadingSpinner";

// Lazy load heavy components for code splitting
const DeviceList = lazy(() => import("./devicelist/DeviceList").then(module => ({ default: module.DeviceList })));
const DeviceGrid = lazy(() => import("./devicegrid/DeviceGrid").then(module => ({ default: module.DeviceGrid })));

/**
 * Props for the DeviceView component.
 */
interface DeviceViewProps {
  /**
   * The current view mode - either grid or list layout.
   */
  viewMode: "grid" | "list";
  /**
   * Array of filtered devices to display.
   */
  filtered: Device[];
  /**
   * Callback function called when a device is selected/opened.
   */
  onOpen: (device: Device) => void;
}


/**
 * DeviceView component that renders devices in either grid or list view based on the viewMode prop.
 *
 * This component acts as a view router that:
 * - Renders DeviceList component for list view mode
 * - Renders DeviceGrid component for grid view mode
 * - Applies consistent product line filtering across both views
 * - Passes through filtered devices and open callback to child components
 * - Provides a clean abstraction for view mode switching
 *
 * @param props - The component props
 * @param props.viewMode - Current view mode selection
 * @param props.filtered - Devices to display (already filtered)
 * @param props.onOpen - Function called when device is opened
 *
 * @example
 * ```tsx
 * <DeviceView
 *   viewMode="grid"
 *   filtered={filteredDevices}
 *   onOpen={(device) => setSelectedDevice(device)}
 * />
 * ```
 */
export const DeviceView: React.FC<DeviceViewProps> = ({
  viewMode,
  filtered,
  onOpen,
}) => {
  // Devices are already filtered at the parent level

  return viewMode === "list" ? (
    <ErrorBoundary
      onError={(error, errorInfo) => logBoundaryError(error, errorInfo, 'DeviceList')}
    >
      <Suspense fallback={<LoadingSpinner message="Loading device list..." />}>
        <DeviceList devices={filtered} onOpen={onOpen} />
      </Suspense>
    </ErrorBoundary>
  ) : (
    <ErrorBoundary
      onError={(error, errorInfo) => logBoundaryError(error, errorInfo, 'DeviceGrid')}
    >
      <Suspense fallback={<LoadingSpinner message="Loading device grid..." />}>
        <DeviceGrid devices={filtered} onOpen={onOpen} />
      </Suspense>
    </ErrorBoundary>
  );
};
