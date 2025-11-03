import { z } from "zod";
import { DeviceResponseSchema, DeviceSchema } from "./validationSchemas";
import type {
  Device,
  DeviceResponse,
  DeviceBTLE,
  DeviceCompliance,
  DeviceUnifi,
  DeviceUISP,
} from "../types/device";

/**
 * What you get back from schema validation operations
 */
export interface ValidationResult<T> {
  success: boolean; // Whether validation worked
  data: T | null; // Validated data if it worked, null if it failed
  error: string | null; // Error details if validation failed, null if it worked
  originalData: unknown; // Original data that was checked
}

// Checks a DeviceResponse against the schema with graceful handling
export function validateDeviceResponse(
  data: unknown
): ValidationResult<DeviceResponse> {
  try {
    const validatedData = DeviceResponseSchema.parse(data);
    return {
      success: true,
      data: validatedData,
      error: null,
      originalData: data,
    };
  } catch (error) {
    const errorMessage =
      error instanceof z.ZodError
        ? `Schema validation failed: ${error.message}`
        : `Validation error: ${String(error)}`;

    console.error("DeviceResponse validation failed:", errorMessage);
    console.error("Original data:", data);

    return {
      success: false,
      data: null,
      error: errorMessage,
      originalData: data,
    };
  }
}

/**
 * Checks a single Device against the schema with graceful handling
 */
export function validateDevice(data: unknown): ValidationResult<Device> {
  try {
    const validatedData = DeviceSchema.parse(data);
    return {
      success: true,
      data: validatedData,
      error: null,
      originalData: data,
    };
  } catch (error) {
    const errorMessage =
      error instanceof z.ZodError
        ? `Device schema validation failed: ${error.message}`
        : `Device validation error: ${String(error)}`;

    console.error("Device validation failed:", errorMessage);
    console.error("Original data:", data);

    return {
      success: false,
      data: null,
      error: errorMessage,
      originalData: data,
    };
  }
}

/**
 * Safely gets a property from an object with a fallback
 */
export function safeGet<T>(obj: unknown, path: string, fallback: T): T {
  if (!obj || typeof obj !== "object") {
    return fallback;
  }

  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current == null || typeof current !== "object" || !(key in current)) {
      return fallback;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return (current as T) ?? fallback;
}

/**
 * Safely gets a string property with fallback
 */
export function safeGetString(
  obj: unknown,
  path: string,
  fallback = ""
): string {
  const value = safeGet(obj, path, fallback);
  return typeof value === "string" ? value : fallback;
}

/**
 * Safely gets a number property with fallback
 */
export function safeGetNumber(
  obj: unknown,
  path: string,
  fallback = 0
): number {
  const value = safeGet(obj, path, fallback);
  return typeof value === "number" && !isNaN(value) ? value : fallback;
}

/**
 * Safely gets a boolean property with fallback
 */
export function safeGetBoolean(
  obj: unknown,
  path: string,
  fallback = false
): boolean {
  const value = safeGet(obj, path, fallback);
  return typeof value === "boolean" ? value : fallback;
}

/**
 * Safely gets an array property with fallback
 */
export function safeGetArray<T = unknown>(
  obj: unknown,
  path: string,
  fallback: T[] = []
): T[] {
  const value = safeGet(obj, path, fallback);
  return Array.isArray(value) ? value : fallback;
}

/**
 * Safely gets an object property with fallback
 */
export function safeGetObject<T extends Record<string, unknown>>(
  obj: unknown,
  path: string,
  fallback: T
): T {
  const value = safeGet(obj, path, fallback);
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as T)
    : fallback;
}

/**
 * Creates a validated device with safe defaults for missing properties
 */
export function createSafeDevice(rawDevice: unknown): Device {
  const validation = validateDevice(rawDevice);

  if (validation.success && validation.data) {
    return validation.data;
  }

  // If validation fails, create a device with safe defaults
  console.warn(
    "Creating safe device due to validation failure:",
    validation.error
  );

  const safeDevice: Partial<Device> = {
    id: safeGetString(rawDevice, "id", "unknown-device"),
    guids: safeGetArray(rawDevice, "guids", []),
    icon: {
      id: safeGetString(rawDevice, "icon.id", "unknown-icon"),
      resolutions: safeGetArray(rawDevice, "icon.resolutions", []),
    },
    images: {
      default: safeGetString(rawDevice, "images.default", ""),
      nopadding: safeGetString(rawDevice, "images.nopadding", ""),
      topology: safeGetString(rawDevice, "images.topology", ""),
    },
    line: {
      id: safeGetString(rawDevice, "line.id", "unknown-line"),
      name: safeGetString(rawDevice, "line.name", "Unknown Line"),
    },
    product: {
      abbrev: safeGetString(rawDevice, "product.abbrev", ""),
      name: safeGetString(rawDevice, "product.name", "Unknown Product"),
    },
    shortnames: safeGetArray(rawDevice, "shortnames", []),
    sku: safeGetString(rawDevice, "sku", "unknown-sku"),
    sysids: safeGetArray(rawDevice, "sysids", []),
    triplets: safeGetArray(rawDevice, "triplets", []),
  };

  // Add optional properties if they exist and are valid
  const btle = safeGetObject(rawDevice, "btle", {} as Partial<DeviceBTLE>);
  if (btle.factoryDefault || btle.userConfigured) {
    safeDevice.btle = btle as DeviceBTLE;
  }

  const compliance = safeGetObject(
    rawDevice,
    "compliance",
    {} as Partial<DeviceCompliance>
  );
  if (Object.keys(compliance).length > 0) {
    safeDevice.compliance = compliance as DeviceCompliance;
  }

  const deviceType = safeGetString(rawDevice, "deviceType");
  if (deviceType) {
    safeDevice.deviceType = deviceType;
  }

  const jrf = safeGetArray(rawDevice, "jrf");
  if (jrf.length > 0) {
    safeDevice.jrf = jrf as string[];
  }

  const minAdoptVersion = safeGetObject(
    rawDevice,
    "minAdoptVersion",
    {} as Record<string, unknown>
  );
  if (minAdoptVersion.net) {
    safeDevice.minAdoptVersion = minAdoptVersion as Device["minAdoptVersion"];
  }

  const sysid = safeGetString(rawDevice, "sysid");
  if (sysid) {
    safeDevice.sysid = sysid;
  }

  const unifi = safeGetObject(rawDevice, "unifi", {} as Partial<DeviceUnifi>);
  if (Object.keys(unifi).length > 0) {
    safeDevice.unifi = unifi as DeviceUnifi;
  }

  const uisp = safeGetObject(rawDevice, "uisp", {} as Partial<DeviceUISP>);
  if (Object.keys(uisp).length > 0) {
    safeDevice.uisp = uisp as DeviceUISP;
  }

  const videos = safeGetObject(
    rawDevice,
    "videos",
    {} as Record<string, unknown>
  );
  if (Object.keys(videos).length > 0) {
    safeDevice.videos = videos;
  }

  const isARSupported = safeGet(rawDevice, "isARSupported", undefined);
  if (typeof isARSupported === "boolean") {
    safeDevice.isARSupported = isARSupported;
  }

  return safeDevice as Device;
}

/**
 * Processes a device response with validation and graceful handling
 */
export function processDeviceResponse(rawResponse: unknown): {
  devices: Device[];
  validationErrors: string[];
  hasValidationErrors: boolean;
} {
  const validation = validateDeviceResponse(rawResponse);

  if (validation.success && validation.data) {
    return {
      devices: validation.data.devices,
      validationErrors: [],
      hasValidationErrors: false,
    };
  }

  // If full response validation fails, try to extract and validate individual devices
  console.warn(
    "Full response validation failed, attempting individual device validation"
  );

  const rawDevices = safeGetArray(rawResponse, "devices", []);
  const validDevices: Device[] = [];
  const validationErrors: string[] = [];

  for (let i = 0; i < rawDevices.length; i++) {
    const deviceValidation = validateDevice(rawDevices[i]);
    if (deviceValidation.success && deviceValidation.data) {
      validDevices.push(deviceValidation.data);
    } else {
      console.warn(
        `Device at index ${i} validation failed:`,
        deviceValidation.error
      );
      validationErrors.push(`Device ${i}: ${deviceValidation.error}`);
      // Create a safe device as fallback
      validDevices.push(createSafeDevice(rawDevices[i]));
    }
  }

  return {
    devices: validDevices,
    validationErrors,
    hasValidationErrors: validationErrors.length > 0,
  };
}
