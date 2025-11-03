import React from "react";
import { type ViewMode } from "../types/device";
import { ListViewIcon } from "./icons/ListViewIcon";
import { GridViewIcon } from "./icons/GridViewIcon";
import styles from "./ViewToggle.module.css";

interface ViewToggleProps {
  /**
   * Current active view mode.
   */
  viewMode: ViewMode;
  /**
   * Callback function called when view mode changes.
   */
  onViewModeChange: (mode: ViewMode) => void;
}

// ViewToggle component that provides buttons to switch between list and grid view modes.
export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className={styles.viewToggle}>
      <button
        className={`${styles.toggleButton} ${
          viewMode === "list" ? styles.active : ""
        }`}
        onClick={() => onViewModeChange("list")}
        aria-label="List view"
        title="List view"
      >
        <div className={styles.toggleIcon}>
          <ListViewIcon />
        </div>
      </button>
      <button
        className={`${styles.toggleButton} ${
          viewMode === "grid" ? styles.active : ""
        }`}
        onClick={() => onViewModeChange("grid")}
        aria-label="Grid view"
        title="Grid view"
      >
        <div className={styles.toggleIcon}>
          <GridViewIcon />
        </div>
      </button>
    </div>
  );
};
