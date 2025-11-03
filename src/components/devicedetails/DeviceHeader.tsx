import React from "react";
import type { Device } from "../../types/device";
import styles from "./DeviceOpen.module.css";

/**
 * Props for the DeviceHeader component.
 */
interface DeviceHeaderProps {
  /**
   * The device object containing name and product line information.
   */
  device: Device;
}

/**
 * DeviceHeader component that displays the device name and product line as a header.
 *
 * This component renders the primary identification information for a device with:
 * - Main device name as the title
 * - Product line name as subtitle
 * - Fallback text for missing information
 * - Consistent header styling for device detail views
 *
 * @param props - The component props
 * @param props.device - Device object with name and line data
 *
 * @example
 * ```tsx
 * <DeviceHeader device={selectedDevice} />
 * ```
 */
export const DeviceHeader: React.FC<DeviceHeaderProps> = ({ device }) => {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>
        {device.product?.name || "Unknown Device"}
      </h2>
      <p className={styles.subtitle}>{device.line?.name || ""}</p>
    </div>
  );
};
