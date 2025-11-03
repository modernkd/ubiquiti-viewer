import React, { useState, useRef, useEffect } from "react";
import type { Device } from "../../types/device";
import styles from "./DeviceFilters.module.css";
import { sanitizeTextInput } from "../../utils/securityUtils";

/**
 * Props for the DeviceFilters component.
 */
interface DeviceFiltersProps {
  /**
   * Array of devices to extract product lines from.
   */
  devices: Device[];
  /**
   * Currently selected product line filters.
   */
  selectedFilters: string[];
  /**
   * Callback when filters change.
   */
  onFiltersChange: (filters: string[]) => void;
}

/**
 * DeviceFilters component that provides a dropdown filter for product lines.
 *
 * Displays a filter icon that opens a dropdown with checkboxes for each unique product line.
 * Matches the design from provided SVGs with inactive/active states.
 */
export const DeviceFilters: React.FC<DeviceFiltersProps> = ({
  devices,
  selectedFilters,
  onFiltersChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique product lines from devices
  const productLines = React.useMemo(() => {
    const lines = new Set<string>();
    devices.forEach((device) => {
      if (device.line?.name) {
        lines.add(sanitizeTextInput(device.line.name));
      }
    });
    return Array.from(lines).sort();
  }, [devices]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (line: string, checked: boolean) => {
    const newFilters = checked
      ? [...selectedFilters, line]
      : selectedFilters.filter((f) => f !== line);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    onFiltersChange([]);
  };

  const isActive = selectedFilters.length > 0;

  return (
    <div className={styles.filterContainer} ref={dropdownRef}>
      <button
        className={`${styles.filterButton} ${isActive ? styles.active : ""}`}
        onClick={handleToggleDropdown}
        aria-label="Filter by product line"
        aria-expanded={isOpen}
      >
        <div className={styles.filterIcon}>
          <span>Filter</span>
        </div>
      </button>
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.filterTitle}>Product line</div>
          <div className={styles.checkboxList}>
            {productLines.map((line) => (
              <label key={line} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(line)}
                  onChange={(e) => handleCheckboxChange(line, e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxCustom}></span>
                <span className={styles.checkboxText}>{line}</span>
              </label>
            ))}
          </div>
          <button className={styles.resetButton} onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
