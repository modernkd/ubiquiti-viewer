import { z } from 'zod';

/**
 * Zod schema for DeviceIcon interface
 */
export const DeviceIconSchema = z.object({
  id: z.string(),
  resolutions: z.array(z.array(z.number())),
});

/**
 * Zod schema for DeviceImages interface
 */
export const DeviceImagesSchema = z.object({
  default: z.string(),
  nopadding: z.string(),
  topology: z.string(),
});

/**
 * Zod schema for DeviceLine interface
 */
export const DeviceLineSchema = z.object({
  id: z.string(),
  name: z.string(),
});

/**
 * Zod schema for DeviceProduct interface
 */
export const DeviceProductSchema = z.object({
  abbrev: z.string(),
  name: z.string(),
});

/**
 * Zod schema for DeviceUISP interface
 */
export const DeviceUISPSchema = z.object({
  bleServices: z.record(z.string(), z.unknown()).optional(),
  firmware: z.object({
    board: z.array(z.string()),
    platform: z.string(),
  }),
  line: z.string(),
  nameLegacy: z.array(z.string()),
});

/**
 * Zod schema for DeviceUnifi interface
 */
export const DeviceUnifiSchema = z.object({
  adoptability: z.string(),
  nameLegacy: z.array(z.string()),
  network: z.object({
    bleServices: z.array(z.unknown()),
    chipset: z.string().optional(),
    deviceCapabilities: z.array(z.string()),
    diagram: z.array(z.string()).optional(),
    ethernetMaxSpeedMegabitsPerSecond: z.number().optional(),
    features: z.record(z.string(), z.unknown()).optional(),
    knownUnsupportedFeatures: z.array(z.string()).optional(),
    linkNegotiation: z.record(z.string(), z.unknown()).optional(),
    minimumFirmwareRequired: z.string().optional(),
    model: z.string(),
    networkGroups: z.record(z.string(), z.string()).optional(),
    numberOfPorts: z.number().optional(),
    ports: z.record(z.string(), z.string()).optional(),
    power: z.object({
      capacity: z.number(),
    }).optional(),
    radios: z.record(z.string(), z.unknown()).optional(),
    shadowMode: z.object({
      interconnectPortInterface: z.string(),
      interconnectPortNumber: z.number(),
    }).optional(),
    subtypes: z.array(z.string()).optional(),
    systemIdHexadecimal: z.string(),
    type: z.string(),
  }).optional(),
});

/**
 * Zod schema for DeviceCompliance interface
 */
export const DeviceComplianceSchema = z.object({
  fcc: z.string().optional(),
  ic: z.string().optional(),
  icEmi: z.string().optional(),
  model: z.string(),
  modelName: z.string().optional(),
  ncc: z.string().optional(),
  rcm: z.boolean().optional(),
  rfCmFcc: z.number().optional(),
  rfCmIc: z.number().optional(),
  text: z.record(z.string(), z.array(z.string())).optional(),
  wifi: z.string().optional(),
  anatel: z.string().optional(),
  cn: z.string().optional(),
  jpa: z.array(z.string()).optional(),
  jrf: z.array(z.string()).optional(),
  indoorOnly: z.boolean().optional(),
});

/**
 * Zod schema for DeviceBTLE interface
 */
export const DeviceBTLESchema = z.object({
  factoryDefault: z.string(),
  userConfigured: z.string(),
});

/**
 * Zod schema for Device interface
 */
export const DeviceSchema = z.object({
  btle: DeviceBTLESchema.optional(),
  compliance: DeviceComplianceSchema.optional(),
  deviceType: z.string().optional(),
  guids: z.array(z.string()),
  icon: DeviceIconSchema,
  id: z.string(),
  images: DeviceImagesSchema,
  jrf: z.array(z.string()).optional(),
  line: DeviceLineSchema,
  minAdoptVersion: z.object({
    net: z.string(),
  }).optional(),
  product: DeviceProductSchema,
  shortnames: z.array(z.string()),
  sku: z.string(),
  sysid: z.string().optional(),
  sysids: z.array(z.string()),
  triplets: z.array(z.object({
    k1: z.string().optional(),
    k2: z.string().optional(),
    k3: z.string().optional(),
  })),
  unifi: DeviceUnifiSchema.optional(),
  uisp: DeviceUISPSchema.optional(),
  videos: z.record(z.string(), z.unknown()).optional(),
  isARSupported: z.boolean().optional(),
});

/**
 * Zod schema for DeviceResponse interface
 */
export const DeviceResponseSchema = z.object({
  devices: z.array(DeviceSchema),
  version: z.string(),
});

/**
 * Type inference from schemas
 */
export type DeviceIcon = z.infer<typeof DeviceIconSchema>;
export type DeviceImages = z.infer<typeof DeviceImagesSchema>;
export type DeviceLine = z.infer<typeof DeviceLineSchema>;
export type DeviceProduct = z.infer<typeof DeviceProductSchema>;
export type DeviceUISP = z.infer<typeof DeviceUISPSchema>;
export type DeviceUnifi = z.infer<typeof DeviceUnifiSchema>;
export type DeviceCompliance = z.infer<typeof DeviceComplianceSchema>;
export type DeviceBTLE = z.infer<typeof DeviceBTLESchema>;
export type Device = z.infer<typeof DeviceSchema>;
export type DeviceResponse = z.infer<typeof DeviceResponseSchema>;