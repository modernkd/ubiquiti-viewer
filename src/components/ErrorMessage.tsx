import React from "react";
import styles from "./ErrorMessage.module.css";

/**
 * Props for the ErrorMessage component.
 */
interface ErrorMessageProps {
  /**
   * The error message to display to the user.
   */
  message: string;
  /**
   * Optional callback function to retry the failed operation.
   */
  onRetry?: () => void;
}

/**
 * ErrorMessage component that displays error states with optional retry functionality.
 *
 * This component provides user-friendly error display with:
 * - Alert icon for visual error indication
 * - Clear error title and descriptive message
 * - Optional retry button with loading icon
 * - Accessible button with proper ARIA labels
 * - Consistent styling for error states across the app
 *
 * @param props - The component props
 * @param props.message - Error message text to display
 * @param props.onRetry - Optional function to call when retry is clicked
 *
 * @example
 * ```tsx
 * <ErrorMessage
 *   message="Failed to load devices"
 *   onRetry={() => fetchDevices()}
 * />
 * ```
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className={styles.errorMessage}>
      <div className={styles.errorIcon}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="12"
            y1="8"
            x2="12"
            y2="12"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="12"
            y1="16"
            x2="12.01"
            y2="16"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
      <h3 className={styles.errorTitle}>Something went wrong</h3>
      <p className={styles.errorText}>{message}</p>
      {onRetry && (
        <button
          className={styles.retryButton}
          onClick={onRetry}
          aria-label="Try again"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "var(--space-1)" }}
          >
            <path
              d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 3v5h-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 16H3v5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
};
