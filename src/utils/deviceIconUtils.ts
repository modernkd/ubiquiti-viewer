import type { Device } from "../types/device";

/**
 * Context for icon resolution selection
 */
export type IconContext = "small" | "medium" | "large";

/**
 * Maps icon contexts to preferred resolutions
 */
const ICON_CONTEXT_RESOLUTIONS: Record<IconContext, number[]> = {
  small: [128, 256], // For grid cards - use higher resolution for better quality
  medium: [64, 128], // For list view
  large: [128, 256], // For detail views
};

/**
 * Cache for constructed URLs to prevent repeated computation
 */
const urlCache = new Map<string, string>();

/**
 * Generates a cache key for URL construction
 */
const getCacheKey = (
  deviceId: string,
  context: IconContext
): string => {
  return `${deviceId}-${context}`;
};

/**
 * Selects the best resolution for a given context from available resolutions
 */
const selectResolution = (
  resolutions: number[][],
  context: IconContext
): number[] => {
  const preferredSizes = ICON_CONTEXT_RESOLUTIONS[context];
  const preferredSize = preferredSizes[0]; // Use first preferred size

  // Find exact match first
  const exactMatch = resolutions.find(([w]) => w === preferredSize);
  if (exactMatch) return exactMatch;

  // Find closest larger size
  const largerSizes = resolutions.filter(([w]) => w >= preferredSize);
  if (largerSizes.length > 0) {
    return largerSizes.reduce((prev, curr) =>
      Math.abs(curr[0] - preferredSize) < Math.abs(prev[0] - preferredSize)
        ? curr
        : prev
    );
  }

  // Fall back to largest available
  return resolutions[resolutions.length - 1] || [32, 32];
};

/**
 * Generates the URL for a device's icon based on the device's icon data and context.
 * Selects appropriate resolution based on context (grid cards vs list view).
 * Falls back to a placeholder icon if no icon data is available.
 *
 * @param device - The device object containing icon information
 * @param context - The context for resolution selection ('small', 'medium', 'large')
 * @returns The URL string for the device icon or a placeholder icon
 *
 * @example
 * ```typescript
 * const device = {
 *   icon: {
 *     id: "uap-ac-pro",
 *     resolutions: [[32, 32], [64, 64]]
 *   }
 * };
 * getIconUrl(device, 'small'); // "https://static.ui.com/fingerprint/ui/icons/uap-ac-pro_32x32.png"
 *
 * const deviceWithoutIcon = {};
 * getIconUrl(deviceWithoutIcon, 'small'); // "/placeholder-icon.png"
 * ```
 */
export const getIconUrl = (
  device: Device,
  context: IconContext = "medium"
): string => {
  const cacheKey = getCacheKey(device.id, context);

  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!;
  }

  let url: string;

  if (device.images?.default) {
    const width = ICON_CONTEXT_RESOLUTIONS[context][0];
    url = `https://images.svc.ui.com/?u=https://static.ui.com/fingerprint/ui/images/${device.id}/default/${device.images.default}.png&w=${width}&q=100&fmt=png`;
  } else if (device.icon?.resolutions?.length) {
    const [width, height] = selectResolution(device.icon.resolutions, context);
    url = `https://static.ui.com/fingerprint/ui/icons/${device.icon.id}_${width}x${height}.png`;
  } else {
    url = "/placeholder-icon.png";
  }

  urlCache.set(cacheKey, url);
  return url;
};


/**
 * Creates an error handler function for image elements that sets a fallback source
 * when the original image fails to load. Useful for handling broken icon URLs gracefully.
 *
 * @param fallbackSrc - The fallback image source URL (defaults to "/placeholder-icon.png")
 * @returns A React event handler function for image error events
 *
 * @example
 * ```typescript
 * // In a React component
 * const handleImageError = createImageErrorHandler("/fallback-icon.png");
 *
 * return (
 *   <img
 *     src={getIconUrl(device)}
 *     onError={handleImageError}
 *     alt="Device icon"
 *   />
 * );
 * ```
 */
export const createImageErrorHandler =
  (fallbackSrc: string = "/placeholder-icon.png") =>
  (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = fallbackSrc;
  };