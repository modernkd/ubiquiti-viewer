// Type definitions for Ubiquiti device data

// Device icon with different sizes for UI
export interface DeviceIcon {
  id: string;
  resolutions: number[][];
}

// Device images for different display contexts
export interface DeviceImages {
  default: string;
  nopadding: string;
  topology: string;
}

// Core device identification and metadata
export interface DeviceCore {
  id: string; // Main device identifier
  sku: string; // Stock keeping unit
  sysid?: string; // System identifier (alternative to id)
  sysids: string[]; // List of system identifiers
  guids: string[]; // Globally unique identifiers
  shortnames: string[]; // Alternative short names
  triplets: Array<{ // Triplet configs for identification
    k1?: string;
    k2?: string;
    k3?: string;
  }>;
}

// Device product and line information
export interface DeviceProductInfo {
  product: DeviceProduct;
  line: DeviceLine;
  icon: DeviceIcon;
  images: DeviceImages;
}

// Device networking and hardware specs
export interface DeviceNetworking {
  unifi?: DeviceUnifi; // UniFi-specific device info
  uisp?: DeviceUISP; // UISP-specific device info
  minAdoptVersion?: { // Minimum adoption version requirements
    net: string; // Network controller version needed
  };
  deviceType?: string; // General device type category
}

// Device compliance and regulatory information
export interface DeviceComplianceInfo {
  compliance?: DeviceCompliance; // Regulatory compliance info
  jrf?: string[]; // JRF compliance identifiers
}

// Device management and connectivity features
export interface DeviceManagement {
  btle?: DeviceBTLE; // Bluetooth Low Energy setup
  isARSupported?: boolean; // AR features support
  videos?: Record<string, unknown>; // Video content references
}

// Product line grouping (like "UniFi Access Points")
export interface DeviceLine {
  id: string;
  name: string;
}

// Basic product details for a Ubiquiti device
export interface DeviceProduct {
  abbrev: string;
  name: string;
}

// UISP-specific device setup for ISP equipment
export interface DeviceUISP {
  bleServices?: Record<string, unknown>;
  firmware: {
    board: string[];
    platform: string;
  };
  line: string;
  nameLegacy: string[];
}

// UniFi-specific device setup and network features
export interface DeviceUnifi {
  adoptability: string;
  network?: {
    bleServices?: unknown[];
    chipset?: string;
    deviceCapabilities: string[];
    diagram?: string[];
    ethernetMaxSpeedMegabitsPerSecond?: number;
    features?: Record<string, unknown>;
    knownUnsupportedFeatures?: string[];
    linkNegotiation?: Record<string, unknown>;
    minimumFirmwareRequired?: string;
    model: string;
    networkGroups?: Record<string, string>;
    numberOfPorts?: number;
    ports?: Record<string, string>;
    power?: {
      capacity: number;
    };
    radios?: Record<string, unknown>;
    shadowMode?: {
      interconnectPortInterface: string;
      interconnectPortNumber: number;
    };
    subtypes?: string[];
    systemIdHexadecimal: string;
    type: string;
  };
  nameLegacy: string[];
}

// Regulatory compliance info for global certifications
export interface DeviceCompliance {
  fcc?: string;
  ic?: string;
  icEmi?: string;
  model: string;
  modelName?: string;
  ncc?: string;
  rcm?: boolean;
  rfCmFcc?: number;
  rfCmIc?: number;
  text?: Record<string, string[]>;
  wifi?: string;
  anatel?: string;
  cn?: string;
  jpa?: string[];
  jrf?: string[];
  indoorOnly?: boolean;
}

// Bluetooth Low Energy setup for device management
export interface DeviceBTLE {
  factoryDefault: string;
  userConfigured: string;
}

// Complete device info structure with all metadata, specs, and config data.
// This interface is brittle and reverse engineered - ideally we'd have proper API types.
export interface Device
  extends DeviceCore,
    DeviceProductInfo,
    DeviceNetworking,
    DeviceComplianceInfo,
    DeviceManagement {}

// API response structure for device data requests
export interface DeviceResponse {
  devices: Device[]; // List of device objects
  version: string; // API response version
}

// View mode options for showing devices in the app
export type ViewMode = "list" | "grid";
