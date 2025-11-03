/**
 * Converts an unknown error into a user-friendly error message.
 * Handles different types of errors with specific messaging for common scenarios
 * like timeouts, 404s, server errors, and network issues.
 *
 * @param error - The error object or value to convert to a message
 * @returns A user-friendly error message string
 *
 * @example
 * ```typescript
 * try {
 *   await fetchDevices();
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   logError(error); // Use centralized logging instead of console.error
 * }
 *
 * // Error handling examples:
 * getErrorMessage(new Error("Request timed out")); // "Request timeout - please try again"
 * getErrorMessage(new Error("404 Not Found")); // "Device data not found"
 * getErrorMessage(new Error("500 Internal Server Error")); // "Server error - please try again later"
 * getErrorMessage(new Error("Failed to fetch")); // "Network error - please check your connection"
 * getErrorMessage("string error"); // "Failed to fetch devices"
 * ```
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (
      error.message.includes("timeout") ||
      error.message.includes("aborted")
    ) {
      return "Request timeout - please try again";
    } else if (error.message.includes("404")) {
      return "Device data not found";
    } else if (
      error.message.includes("500") ||
      error.message.includes("server error")
    ) {
      return "Server error - please try again later";
    } else if (
      error.message.includes("network") ||
      error.message.includes("fetch")
    ) {
      return "Network error - please check your connection";
    }
    return error.message;
  }
  return "Failed to fetch devices";
};

/**
 * Centralized error logging utility that handles logging appropriately based on environment.
 * In development, logs to console. In production, could send to error reporting service.
 *
 * @param error - The error to log
 * @param context - Optional context information about where the error occurred
 * @param additionalData - Optional additional data to include in the log
 */
export const logError = (
  error: unknown,
  context?: string,
  additionalData?: Record<string, unknown>
): void => {
  const errorInfo = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    additionalData,
    timestamp: new Date().toISOString(),
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  };

  if (process.env.NODE_ENV === "development") {
    console.error("Error logged:", errorInfo);
  } else {
    // In production, send to error reporting service
    // Example: sendToErrorReportingService(errorInfo);
    // For now, we'll silently log (could be enhanced to use services like Sentry, LogRocket, etc.)
    reportError();
  }
};

/**
 * Reports errors to external error reporting services.
 * This function can be enhanced to integrate with services like Sentry, LogRocket, etc.
 */
const reportError = (): void => {
  // TODO: Integrate with proper error reporting service
  // Example implementations:
  // - Sentry: Sentry.captureException(error, { extra: errorInfo });
  // - LogRocket: LogRocket.captureException(error, { extra: errorInfo });
  // - Custom service: fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorInfo) });
  // For now, errors are only logged to console in development
};

/**
 * Logs React Error Boundary errors with component stack information.
 *
 * @param error - The error that was caught
 * @param errorInfo - React error info containing component stack
 * @param componentName - Optional name of the component where the error occurred
 */
export const logBoundaryError = (
  error: Error,
  errorInfo: React.ErrorInfo,
  componentName?: string
): void => {
  logError(
    error,
    `ErrorBoundary${componentName ? ` (${componentName})` : ""}`,
    {
      componentStack:
        errorInfo.componentStack || "No component stack available",
    }
  );
};
