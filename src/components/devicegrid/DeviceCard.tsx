import React from "react";
import { type Device } from "../../types/device";
import { DeviceIcon } from "../DeviceIcon";
import styles from "./DeviceCard.module.css";

// Props for the DeviceCard component
interface DeviceCardProps {
  device: Device; // The device object to display
  onOpen?: (device: Device) => void; // Optional callback when card is clicked
  selected?: boolean; // Whether the card is currently selected/highlighted
}

// DeviceCard component that displays a device in a card format for grid view.
// Shows device icon, product abbreviation, name, and handles clicks.
export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onOpen,
  selected = false,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`${styles.deviceCard} ${selected ? styles.selected : ""}`}
      onClick={() => onOpen?.(device)}
      onKeyDown={(e) => {
        // Support keyboard activation (Enter / Space)
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.(device);
        }
      }}
      aria-pressed={selected}
    >
      <div className={styles.thumbBox}>
        <DeviceIcon
          device={device}
          className={styles.deviceIcon}
          context="small"
          lazy={true}
        />
        <div className={styles.modelBadge} aria-hidden>
          UniFi
        </div>
      </div>
      <div className={styles.deviceInfo}>
        <h3 className={styles.deviceName}>{device.product.name}</h3>
        <p className={styles.deviceModel}>{device.product.abbrev}</p>
      </div>
    </div>
  );
};
