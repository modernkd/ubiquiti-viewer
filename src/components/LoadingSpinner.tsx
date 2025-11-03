import React from 'react';
import styles from './LoadingSpinner.module.css';

/**
 * Props for the LoadingSpinner component.
 */
interface LoadingSpinnerProps {
  /**
   * Optional loading message to display below the spinner.
   * @default "Loading devices..."
   */
  message?: string;
}

/**
 * LoadingSpinner component that displays a loading indicator with optional message.
 *
 * This component provides visual feedback during loading states with:
 * - Animated CSS spinner for visual loading indication
 * - Customizable loading message
 * - Consistent styling for loading states across the app
 * - Centered layout for optimal user experience
 *
 * @param props - The component props
 * @param props.message - Text to display below the spinner
 *
 * @example
 * ```tsx
 * <LoadingSpinner message="Fetching device data..." />
 * ```
 *
 * @example
 * ```tsx
 * <LoadingSpinner /> // Uses default message
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading devices...' }) => {
  return (
    <div className={styles.loadingSpinner}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>{message}</p>
    </div>
  );
};
