import type { Device } from "../types/device";

/**
 * Extracts a human-readable display name for a device, prioritizing product name,
 * then line name, with a fallback to "Unknown Device" if neither is available.
 *
 * @param device - The device object to extract the display name from
 * @returns The display name string for the device
 *
 * @example
 * ```typescript
 * const device = { product: { name: "UniFi AP AC Pro" } };
 * getDeviceDisplayName(device); // "UniFi AP AC Pro"
 *
 * const deviceWithoutProduct = { line: { name: "UniFi Access Points" } };
 * getDeviceDisplayName(deviceWithoutProduct); // "UniFi Access Points"
 *
 * const emptyDevice = {};
 * getDeviceDisplayName(emptyDevice); // "Unknown Device"
 * ```
 */
export const getDeviceDisplayName = (device: Device): string => {
  return device.product?.name || device.line?.name || "Unknown Device";
};

/**
 * Extracts a unique identifier for a device, preferring sysid over id,
 * with an empty string fallback if neither is available.
 *
 * @param device - The device object to extract the identifier from
 * @returns The device identifier string or empty string
 *
 * @example
 * ```typescript
 * const device = { sysid: "ABC123", id: "DEF456" };
 * getDeviceIdentifier(device); // "ABC123"
 *
 * const deviceWithIdOnly = { id: "DEF456" };
 * getDeviceIdentifier(deviceWithIdOnly); // "DEF456"
 *
 * const deviceWithoutIds = {};
 * getDeviceIdentifier(deviceWithoutIds); // ""
 * ```
 */
export const getDeviceIdentifier = (device: Device): string | null => {
  return device.sysid || device.id || null;
};

/**
 * Extracts the power capacity of a device in watts, formatted as a string.
 * Returns "—" if no power capacity information is available.
 *
 * @param device - The device object to extract power capacity from
 * @returns The power capacity string (e.g., "48 W") or "—" if unavailable
 *
 * @example
 * ```typescript
 * const device = { unifi: { network: { power: { capacity: 48 } } } };
 * getDevicePowerCapacity(device); // "48 W"
 *
 * const deviceWithoutPower = {};
 * getDevicePowerCapacity(deviceWithoutPower); // "—"
 * ```
 */
export const getDevicePowerCapacity = (device: Device): string | null => {
  const capacity = device.unifi?.network?.power?.capacity;
  return capacity ? `${capacity} W` : null;
};

/**
 * Extracts the maximum Ethernet speed of a device in Mbps, formatted as a string.
 * Returns "—" if no speed information is available.
 *
 * @param device - The device object to extract speed from
 * @returns The speed string (e.g., "1000 Mbps") or "—" if unavailable
 *
 * @example
 * ```typescript
 * const device = { unifi: { network: { ethernetMaxSpeedMegabitsPerSecond: 1000 } } };
 * getDeviceSpeed(device); // "1000 Mbps"
 *
 * const deviceWithoutSpeed = {};
 * getDeviceSpeed(deviceWithoutSpeed); // "—"
 * ```
 */
export const getDeviceSpeed = (device: Device): string | null => {
  const speed = device.unifi?.network?.ethernetMaxSpeedMegabitsPerSecond;
  return speed ? `${speed} Mbps` : null;
};

/**
 * Extracts the number of ports on a device as a string.
 * Returns "—" if no port count information is available.
 *
 * @param device - The device object to extract port count from
 * @returns The port count string or "—" if unavailable
 *
 * @example
 * ```typescript
 * const device = { unifi: { network: { numberOfPorts: 8 } } };
 * getDevicePortCount(device); // "8"
 *
 * const deviceWithoutPorts = {};
 * getDevicePortCount(deviceWithoutPorts); // "—"
 * ```
 */
export const getDevicePortCount = (device: Device): string | null => {
  return device.unifi?.network?.numberOfPorts?.toString() ?? null;
};

/**
 * Extracts the model name of a device from UniFi network information.
 * Returns an empty string if no model information is available.
 *
 * @param device - The device object to extract model from
 * @returns The device model string or empty string if unavailable
 *
 * @example
 * ```typescript
 * const device = { unifi: { network: { model: "US-8-150W" } } };
 * getDeviceModel(device); // "US-8-150W"
 *
 * const deviceWithoutModel = {};
 * getDeviceModel(deviceWithoutModel); // ""
 * ```
 */
export const getDeviceModel = (device: Device): string | null => {
  return device.unifi?.network?.model || null;
};
