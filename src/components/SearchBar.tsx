import React, {
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
} from "react";
import styles from "./SearchBar.module.css";
import type { Device } from "../types/device";
import {
  generateAutocompleteSuggestions,
  highlightMatchingText,
  type AutocompleteSuggestion,
} from "../utils/deviceFilters";

/**
 * Props for the SearchBar component.
 */
interface SearchBarProps {
  /**
   * Current search input value.
   */
  value: string;
  /**
   * Callback function called when the search value changes.
   */
  onChange: (v: string) => void;
  /**
   * Placeholder text for the search input.
   * @default "Search"
   */
  placeholder?: string;
  /**
   * Array of devices to generate autocomplete suggestions from.
   */
  devices: Device[];
}

/**
 * SearchBar component that provides a search input field with autocomplete suggestions.
 *
 * This component renders a search interface with:
 * - Search icon for visual indication
 * - Controlled input field for search text
 * - Autocomplete dropdown with device suggestions
 * - Keyboard navigation (arrow keys, enter, escape)
 * - Mouse interaction for suggestions
 * - Customizable placeholder text
 * - Proper accessibility with ARIA labels
 * - Consistent styling for search functionality
 *
 * @param props - The component props
 * @param props.value - Current search value
 * @param props.onChange - Function called on value change
 * @param props.placeholder - Input placeholder text
 * @param props.devices - Array of devices for suggestions
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   placeholder="Search devices..."
 *   devices={allDevices}
 * />
 * ```
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search",
  devices,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate suggestions with 150ms debounce
  const suggestions = useMemo(() => {
    if (localValue.length < 2) return [];
    return generateAutocompleteSuggestions(devices, localValue);
  }, [devices, localValue]);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Show/hide dropdown based on suggestions and focus
  useEffect(() => {
    setIsDropdownVisible(suggestions.length > 0);
    setSelectedIndex(-1);
  }, [suggestions]);

  const debouncedOnChange = useCallback(
    (inputValue: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onChange(inputValue);
      }, 300); // Keep original 300ms for search, suggestions use 150ms
    },
    [onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleSuggestionSelect = (suggestion: AutocompleteSuggestion) => {
    setLocalValue(suggestion.text);
    setIsDropdownVisible(false);
    setSelectedIndex(-1);
    onChange(suggestion.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownVisible || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsDropdownVisible(false);
        setSelectedIndex(-1);
        break;
      case "Tab":
        // Allow default tab behavior to move focus to suggestions
        break;
    }
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsDropdownVisible(true);
    }
  };

  const handleSuggestionKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        handleSuggestionSelect(suggestions[index]);
        break;
      case "Escape":
        e.preventDefault();
        setIsDropdownVisible(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();
        break;
      case "ArrowDown": {
        e.preventDefault();
        const nextIndex = index < suggestions.length - 1 ? index + 1 : 0;
        setSelectedIndex(nextIndex);
        // Focus the next suggestion
        const nextElement = dropdownRef.current?.children[nextIndex] as HTMLElement;
        nextElement?.focus();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prevIndex = index > 0 ? index - 1 : suggestions.length - 1;
        setSelectedIndex(prevIndex);
        // Focus the previous suggestion
        const prevElement = dropdownRef.current?.children[prevIndex] as HTMLElement;
        prevElement?.focus();
        break;
      }
    }
  };

  // Close dropdown when clicking or touching outside the input/dropdown.
  // This prevents the dropdown from staying open when the user clicks elsewhere
  // in the page (e.g. on another UI element or the page background).
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent | TouchEvent) => {
      const target = (e.target as Node) || null;
      if (
        !inputRef.current?.contains(target as Node) &&
        !dropdownRef.current?.contains(target as Node)
      ) {
        setIsDropdownVisible(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("touchstart", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("touchstart", handleDocumentClick);
    };
  }, []);

  return (
    <div className={styles.searchWrap}>
      <img
        src="/images/search-icon.svg"
        alt="Search"
        className={styles.searchIcon}
      />
      <input
        ref={inputRef}
        className={styles.searchInput}
        value={localValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        aria-label="Search devices"
        aria-expanded={isDropdownVisible}
        aria-haspopup="listbox"
        role="combobox"
        aria-autocomplete="list"
      />
      {isDropdownVisible && (
        <div
          ref={dropdownRef}
          className={styles.suggestionsDropdown}
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.text}
              className={`${styles.suggestionItem} ${
                index === selectedIndex ? styles.suggestionItemSelected : ""
              }`}
              onMouseDown={() => handleSuggestionSelect(suggestion)}
              onFocus={() => setSelectedIndex(index)}
              onKeyDown={(e) => handleSuggestionKeyDown(e, index)}
              tabIndex={0}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <span className={styles.suggestionText}>
                {highlightMatchingText(suggestion.text, localValue)}
              </span>
              <span className={styles.suggestionShortname}>
                {suggestion.shortname}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
