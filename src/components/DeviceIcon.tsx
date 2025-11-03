import React from "react";
import type { Device } from "../types/device";
import {
  getIconUrl,
  createImageErrorHandler,
  type IconContext,
} from "../utils/deviceIconUtils";

/**
 * Props for the DeviceIcon component.
 */
interface DeviceIconProps {
  /**
   * The device object containing icon information.
   */
  device: Device;
  /**
   * Optional CSS class name to apply to the icon image.
   */
  className?: string;
  /**
   * Context for resolution selection ('small', 'medium', 'large').
   * @default 'medium'
   */
  context?: IconContext;
  /**
   * Whether to enable lazy loading for the image.
   * @default false
   */
  lazy?: boolean;
  /**
   * Alt text for the image. If not provided, uses device name.
   */
  alt?: string;
}

/**
 * DeviceIcon component that displays the appropriate icon for a Ubiquiti device.
 *
 * This component renders device icons with:
 * - Context-aware resolution selection (small/medium/large)
 * - Lazy loading support for performance
 * - Enhanced error handling with format fallbacks
 * - Proper alt text for accessibility
 *
 * @param props - The component props
 * @param props.device - Device object with icon data
 * @param props.className - Optional CSS class for styling
 * @param props.context - Resolution context ('small', 'medium', 'large')
 * @param props.lazy - Whether to enable lazy loading
 * @param props.alt - Custom alt text (defaults to device name)
 *
 * @example
 * ```tsx
 * <DeviceIcon device={device} context="small" lazy={true} />
 * ```
 */
export const DeviceIcon: React.FC<DeviceIconProps> = ({
  device,
  className,
  context = "medium",
  lazy = false,
  alt,
}) => {
  const imageUrl = getIconUrl(device, context);

  const altText = alt || `${device.product?.name || "Device"} icon`;

  return (
    <img
      src={imageUrl}
      alt={altText}
      className={className}
      loading={lazy ? "lazy" : "eager"}
      onError={createImageErrorHandler("/placeholder-icon.png")}
    />
  );
};
