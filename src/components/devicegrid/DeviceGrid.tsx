import React from "react";
import { type Device } from "../../types/device";
import { DeviceCard } from "./DeviceCard";
import styles from "./DeviceGrid.module.css";

/**
 * Props for the DeviceGrid component.
 */
interface DeviceGridProps {
  /**
   * Array of devices to display in the grid layout.
   */
  devices: Device[];
  /**
   * Optional callback function called when a device card is clicked.
   */
  onOpen?: (device: Device) => void;
}

/**
 * DeviceGrid component that displays devices in a responsive grid layout using DeviceCard components.
 *
 * This component renders a grid of device cards with:
 * - Responsive CSS Grid layout
 * - Individual DeviceCard components for each device
 * - Click handling for device selection
 * - Consistent spacing and styling
 * - Support for empty device arrays
 *
 * @param props - The component props
 * @param props.devices - Array of devices to display
 * @param props.onOpen - Optional callback when a device is selected
 *
 * @example
 * ```tsx
 * <DeviceGrid
 *   devices={filteredDevices}
 *   onOpen={(device) => setSelectedDevice(device)}
 * />
 * ```
 */
export const DeviceGrid: React.FC<DeviceGridProps> = ({ devices, onOpen }) => {
  return (
    <div className={styles.deviceGrid}>
      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} onOpen={onOpen} />
      ))}
    </div>
  );
};
