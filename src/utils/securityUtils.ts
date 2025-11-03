/**
 * Security utility functions for input sanitization and content protection.
 *
 * This module provides functions to sanitize user inputs and prevent common web vulnerabilities
 * such as XSS attacks and injection attacks. Uses DOMPurify extensively for battle-tested sanitization.
 */
import DOMPurify from "dompurify";

/**
 * Sanitizes text input by removing HTML and dangerous content.
 * Uses DOMPurify for comprehensive HTML removal, then applies additional text-specific cleaning.
 *
 * @param input - The input string to sanitize
 * @param maxLength - Maximum allowed length (default: 1000)
 * @returns The sanitized string safe for text contexts
 *
 * @example
 * ```typescript
 * sanitizeTextInput("hello<script>alert('xss')</script>world"); // "helloworld"
 * sanitizeTextInput("normal text"); // "normal text"
 * ```
 */
export const sanitizeTextInput = (input: string, maxLength = 1000): string => {
  if (typeof input !== "string") {
    return "";
  }

  // First limit length to prevent DoS
  let sanitized = input.substring(0, maxLength);

  // Use DOMPurify to strip all HTML and dangerous content
  sanitized = DOMPurify.sanitize(sanitized, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    ALLOW_DATA_ATTR: false,
  });

  // Additional text-specific cleaning
  // Remove control characters (except common whitespace)
  sanitized = sanitized.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
    ""
  );

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, " ").trim();

  return sanitized;
};

/**
 * Sanitizes HTML content using DOMPurify to prevent XSS attacks.
 * DOMPurify is a battle-tested library that provides comprehensive HTML sanitization.
 *
 * @param html - The HTML string to sanitize
 * @returns The sanitized HTML string
 *
 * @example
 * ```typescript
 * sanitizeHTML("<p>Hello <script>alert('xss')</script>world</p>"); // "<p>Hello world</p>"
 * sanitizeHTML("<p>Safe content</p>"); // "<p>Safe content</p>"
 * ```
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof html !== "string") {
    return "";
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "u",
      "strong",
      "em",
      "p",
      "br",
      "span",
      "a",
      "img",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title"],
    ALLOW_DATA_ATTR: false,
  });
};

/**
 * Validates and sanitizes a URL to prevent malicious redirects and injection.
 * Uses DOMPurify for initial cleaning, then validates URL structure.
 *
 * @param url - The URL string to validate and sanitize
 * @param allowedProtocols - Array of allowed protocols (default: ['http:', 'https:'])
 * @returns The sanitized URL or empty string if invalid
 *
 * @example
 * ```typescript
 * sanitizeURL("https://example.com"); // "https://example.com"
 * sanitizeURL("javascript:alert('xss')"); // ""
 * ```
 */
export const sanitizeURL = (
  url: string,
  allowedProtocols = ["http:", "https:"]
): string => {
  if (typeof url !== "string") {
    return "";
  }

  // First sanitize with DOMPurify to remove any HTML
  const sanitized = DOMPurify.sanitize(url, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
  });

  try {
    const urlObj = new URL(sanitized);

    // Check if protocol is allowed
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return "";
    }

    // Remove dangerous URL components
    urlObj.username = "";
    urlObj.password = "";
    urlObj.hash = "";

    return urlObj.toString();
  } catch {
    // Invalid URL format
    return "";
  }
};

/**
 * Escapes HTML entities to prevent XSS in dynamic content rendering.
 * Uses DOMPurify's text-only sanitization for comprehensive escaping.
 *
 * @param text - The text to escape
 * @returns The escaped text safe for HTML insertion
 *
 * @example
 * ```typescript
 * escapeHTML("<script>alert('xss')</script>"); // "<script>alert(&#x27;xss&#x27;)</script>"
 * escapeHTML("normal text"); // "normal text"
 * ```
 */
export const escapeHTML = (text: string): string => {
  if (typeof text !== "string") {
    return "";
  }

  // Use DOMPurify to escape HTML entities
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
  });
};

/**
 * Validates that a string contains only safe characters for user input.
 * Uses DOMPurify for initial cleaning, then validates against a whitelist pattern.
 *
 * @param input - The input string to validate
 * @param maxLength - Maximum allowed length (default: 500)
 * @returns true if the input is safe, false otherwise
 *
 * @example
 * ```typescript
 * isSafeInput("hello world"); // true
 * isSafeInput("hello<script>"); // false
 * ```
 */
export const isSafeInput = (input: string, maxLength = 500): boolean => {
  if (typeof input !== "string") {
    return false;
  }

  if (input.length > maxLength) {
    return false;
  }

  // First sanitize with DOMPurify
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
  });

  // Allow alphanumeric, spaces, and basic punctuation
  const safePattern = /^[a-zA-Z0-9\s\-_.!?()]+$/;
  return safePattern.test(sanitized);
};

/**
 * Sanitizes a search query by removing dangerous characters while preserving search functionality.
 * Uses DOMPurify extensively, then applies search-specific cleaning.
 *
 * @param query - The search query to sanitize
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns The sanitized search query
 *
 * @example
 * ```typescript
 * sanitizeSearchQuery("unifi<script>alert('xss')</script>"); // "unifi"
 * sanitizeSearchQuery("normal query"); // "normal query"
 * ```
 */
export const sanitizeSearchQuery = (query: string, maxLength = 100): string => {
  if (typeof query !== "string") {
    return "";
  }

  // First limit length
  let sanitized = query.substring(0, maxLength);

  // Use DOMPurify to strip HTML and dangerous content
  sanitized = DOMPurify.sanitize(sanitized, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
  });

  // Additional search-specific sanitization
  // Remove SQL operators that could be dangerous in search contexts
  sanitized = sanitized.replace(
    /\b(and|or|not|union|select|insert|update|delete|drop|create|alter)\b/gi,
    ""
  );

  // Remove potential path traversal
  sanitized = sanitized.replace(/\.\./g, "");

  // Remove excessive wildcards
  sanitized = sanitized.replace(/\*{2,}/g, "*");

  // Remove control characters
  sanitized = sanitized.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, " ").trim();

  return sanitized;
};
