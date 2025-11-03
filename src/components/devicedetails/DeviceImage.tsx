import React from "react";
import type { Device } from "../../types/device";
import { getIconUrl, createImageErrorHandler } from "../../utils/deviceIconUtils";
import styles from "./DeviceOpen.module.css";

/**
 * Props for the DeviceImage component.
 */
interface DeviceImageProps {
   /**
    * The device object containing icon information for image display.
    */
   device: Device;
   /**
    * Whether to enable lazy loading for the image.
    * @default false
    */
   lazy?: boolean;
}

/**
 * DeviceImage component that displays the product image for a Ubiquiti device.
 *
 * This component renders device product images with:
 * - Context-aware resolution selection for detail views
 * - Lazy loading support for performance optimization
 * - Enhanced error handling with format fallbacks
 * - Proper alt text for accessibility
 * - Responsive image container styling
 *
 * @param props - The component props
 * @param props.device - Device object with icon data
 * @param props.lazy - Whether to enable lazy loading
 *
 * @example
 * ```tsx
 * <DeviceImage device={selectedDevice} lazy={true} />
 * ```
 */
export const DeviceImage: React.FC<DeviceImageProps> = ({ device, lazy = false }) => {
  // Try to use product image first, fall back to icon with larger size
  const imageUrl = device.images?.default
    ? `https://images.svc.ui.com/?u=https://static.ui.com/fingerprint/ui/images/${device.id}/default/${device.images.default}.png&w=512&q=100&fmt=png`
    : device.icon?.id
    ? getIconUrl(device, 'large')
    : null;

  return (
    <div className={styles.imageBox}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${device.product?.name || "Device"} product image`}
          className={styles.productImage}
          loading={lazy ? 'lazy' : 'eager'}
          onError={createImageErrorHandler("/placeholder-icon.png")}
        />
      ) : (
        <div className={styles.placeholder}>No Image Available</div>
      )}
    </div>
  );
};