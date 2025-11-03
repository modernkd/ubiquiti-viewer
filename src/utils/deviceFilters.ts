import type { Device } from "../types/device";
import React from "react";

/**
 * What autocomplete suggestions look like.
 */
export interface AutocompleteSuggestion {
  text: string; // The text to show in the suggestion
  shortname: string; // The short name for the device (like "UDM" or "UAP")
}

// Checks if a device matches what the user is searching for.
export function matchesSearchQuery(device: Device, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const searchableFields = [
    device.product?.name || "",
    device.product?.abbrev || "",
    device.line?.name || "",
    device.sku || "",
    device.sysid || device.id || "",
    ...(device.shortnames || []),
  ]
    .join(" ")
    .toLowerCase();

  return searchableFields.includes(q);
}

/**
 * Filters devices by what the user is searching for.
 */
export const filterDevices = (devices: Device[], query: string): Device[] => {
  if (!devices?.length) return [];
  return devices.filter((device) => matchesSearchQuery(device, query));
};

// Creates autocomplete suggestions from device data based on what the user is typing.
// Looks through device names, abbreviations, lines, SKUs, IDs, and short names.
export const generateAutocompleteSuggestions = (
  devices: Device[],
  query: string
): AutocompleteSuggestion[] => {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 2) return [];

  const exactMatches: AutocompleteSuggestion[] = [];
  const prefixMatches: AutocompleteSuggestion[] = [];
  const containsMatches: AutocompleteSuggestion[] = [];
  const seen = new Set<string>();

  devices.forEach((device) => {
    const name = device.product?.name || "";
    if (!name) return;

    const lowerName = name.toLowerCase();
    const abbrev = device.product?.abbrev?.toLowerCase() || "";
    const line = device.line?.name?.toLowerCase() || "";
    const sku = device.sku?.toLowerCase() || "";
    const id = (device.sysid || device.id || "").toLowerCase();
    const shortnames = (device.shortnames || []).join(" ").toLowerCase();

    const fields = [lowerName, abbrev, line, sku, id, shortnames];

    let bestMatchType: "exact" | "prefix" | "contains" | null = null;
    let hasExact = false;

    for (const field of fields) {
      if (!field) continue;
      if (field === q) {
        bestMatchType = "exact";
        hasExact = true;
        break;
      } else if (field.startsWith(q) && !hasExact) {
        bestMatchType = "prefix";
      } else if (field.includes(q) && !hasExact && bestMatchType !== "prefix") {
        bestMatchType = "contains";
      }
    }

    if (bestMatchType && !seen.has(lowerName)) {
      seen.add(lowerName);
      const suggestion: AutocompleteSuggestion = {
        text: name,
        shortname: device.shortnames?.[0] || device.product?.abbrev || "",
      };
      if (bestMatchType === "exact") {
        exactMatches.push(suggestion);
      } else if (bestMatchType === "prefix") {
        prefixMatches.push(suggestion);
      } else {
        containsMatches.push(suggestion);
      }
    }
  });

  // Combine in priority order
  const allSuggestions = [
    ...exactMatches,
    ...prefixMatches,
    ...containsMatches,
  ];

  return allSuggestions.slice(0, 8);
};

// Creates a React element that highlights the matching text with underlines.
export const highlightMatchingText = (
  text: string,
  query: string
): React.ReactElement => {
  if (!query.trim()) {
    return React.createElement("span", null, text);
  }

  const q = query.toLowerCase();
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(q);

  if (index === -1) {
    return React.createElement("span", null, text);
  }

  const beforeMatch = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const afterMatch = text.slice(index + query.length);

  return React.createElement(
    "span",
    null,
    beforeMatch,
    React.createElement(
      "span",
      { style: { textDecoration: "underline", fontWeight: "bold" } },
      match
    ),
    afterMatch
  );
};
