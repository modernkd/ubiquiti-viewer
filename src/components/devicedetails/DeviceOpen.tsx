import React, { useState, useEffect, useRef } from "react";
import styles from "./DeviceOpen.module.css";
import { type Device } from "../../types/device";
import { DeviceHeader } from "./DeviceHeader";
import { DeviceImage } from "./DeviceImage";
import { DeviceDetails } from "./DeviceDetails";

/**
 * Props for the DeviceOpen component.
 */
interface DeviceOpenProps {
  /**
   * The device object to display detailed information for.
   */
  device: Device;
  /**
   * Array of filtered devices for navigation context.
   */
  filteredDevices?: Device[];
  /**
   * Callback function called when the close button is clicked.
   */
  onClose: () => void;
  /**
   * Callback function called when navigating to the previous device.
   */
  onPrevious?: () => void;
  /**
   * Callback function called when navigating to the next device.
   */
  onNext?: () => void;
}

/**
 * DeviceOpen component that displays comprehensive device details in a modal-like layout.
 *
 * This component renders a complete device detail view with:
 * - Close button for dismissing the detail view
 * - Device product image
 * - Device header with name and product line
 * - Detailed device specifications
 * - Call-to-action for viewing raw JSON data
 * - Proper ARIA attributes for accessibility
 * - Responsive layout with image and details columns
 *
 * @param props - The component props
 * @param props.device - Device object with complete device data
 * @param props.onClose - Function called when closing the detail view
 *
 * @example
 * ```tsx
 * <DeviceOpen
 *   device={selectedDevice}
 *   onClose={() => setSelectedDevice(null)}
 * />
 * ```
 */
export const DeviceOpen: React.FC<DeviceOpenProps> = ({
  device,
  filteredDevices,
  onClose,
  onPrevious,
  onNext,
}) => {
  const [showJson, setShowJson] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Focus management: move focus to header when component mounts
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.focus();
    }
  }, []);

  // Find current device index in filtered devices
  const currentIndex =
    filteredDevices?.findIndex((d) => d.id === device.id) ?? -1;
  const hasPrevious = currentIndex > 0;
  const hasNext =
    currentIndex >= 0 && currentIndex < (filteredDevices?.length ?? 0) - 1;

  return (
    <div
      className={styles.deviceOpenRoot}
      role="dialog"
      aria-label="Product details"
    >
      <div
        ref={headerRef}
        className={styles.headerControls}
        tabIndex={-1}
        aria-label={`${device.product?.name || "Device"} details`}
      >
        <button
          className={styles.backBtn}
          onClick={onClose}
          aria-label="Back to device list"
        >
          ← Back
        </button>
        <div className={styles.navControls}>
          <button
            className={styles.navBtn}
            onClick={onPrevious}
            disabled={!hasPrevious}
            aria-label="Previous device"
          >
            ‹
          </button>
          <button
            className={styles.navBtn}
            onClick={onNext}
            disabled={!hasNext}
            aria-label="Next device"
          >
            ›
          </button>
        </div>
      </div>
      <div className={styles.contentRow}>
        <DeviceImage device={device} />
        <div className={styles.detailCol}>
          <DeviceHeader device={device} />
          <DeviceDetails device={device} />
        </div>
      </div>
      <button
        className={styles.cta}
        onClick={() => setShowJson(!showJson)}
        aria-label="Toggle JSON details"
      >
        {showJson ? "Hide JSON Details" : "See All Details as JSON"}
      </button>
      {showJson && (
        <pre className={styles.jsonDisplay}>
          {JSON.stringify(device, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DeviceOpen;
