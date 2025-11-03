import React from "react";
import type { Device } from "../../types/device";
import {
  getDeviceIdentifier,
  getDevicePowerCapacity,
  getDeviceSpeed,
  getDevicePortCount,
} from "../../utils/deviceTransformers";
import styles from "./DeviceOpen.module.css";

/**
 * Props for the DeviceDetails component.
 */
interface DeviceDetailsProps {
  /**
   * The device object containing all device information to display.
   */
  device: Device;
}

/**
 * DeviceDetails component that displays detailed information about a Ubiquiti device.
 *
 * This component renders device specifications in a structured format with:
 * - Product line information
 * - Device identifier (SKU/Model)
 * - Product name and abbreviation
 * - Power capacity specifications
 * - Speed capabilities
 * - Port count information
 * - Formatted display using device transformer utilities
 *
 * @param props - The component props
 * @param props.device - Device object with complete device data
 *
 * @example
 * ```tsx
 * <DeviceDetails device={selectedDevice} />
 * ```
 */
export const DeviceDetails: React.FC<DeviceDetailsProps> = ({ device }) => {
  return (
    <div className={styles.rows}>
      <div className={styles.row}>
        <span className={styles.label}>Product Line:</span>
        <span className={styles.value}>{device.line?.name || "—"}</span>
      </div>
      {getDeviceIdentifier(device) && (
        <div className={styles.row}>
          <span className={styles.label}>ID:</span>
          <span className={styles.value}>{getDeviceIdentifier(device)}</span>
        </div>
      )}
      <div className={styles.row}>
        <span className={styles.label}>Name:</span>
        <span className={styles.value}>{device.product?.name || "—"}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Short Name:</span>
        <span className={styles.value}>{device.product?.abbrev || "—"}</span>
      </div>
      {getDevicePowerCapacity(device) && (
        <div className={styles.row}>
          <span className={styles.label}>Max. Power:</span>
          <span className={styles.value}>{getDevicePowerCapacity(device)}</span>
        </div>
      )}
      {getDeviceSpeed(device) && (
        <div className={styles.row}>
          <span className={styles.label}>Speed:</span>
          <span className={styles.value}>{getDeviceSpeed(device)}</span>
        </div>
      )}
      {getDevicePortCount(device) && (
        <div className={styles.row}>
          <span className={styles.label}>Number of Ports:</span>
          <span className={styles.value}>{getDevicePortCount(device)}</span>
        </div>
      )}
    </div>
  );
};
