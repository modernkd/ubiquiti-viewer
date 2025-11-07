import { useState, useEffect } from "react";
import { useDevices } from "./hooks/useDevices";
import { useDeviceFilters } from "./hooks/useDeviceFilters";
import { DeviceToolbar } from "./components/DeviceToolbar";
import { DeviceView } from "./components/DeviceView";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorMessage } from "./components/ErrorMessage";
import { DeviceDetailRoute } from "./components/devicedetails/DeviceDetailRoute";
import { type ViewMode, type Device } from "./types/device";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import { UbiquitiLogo } from "./components/icons/UbiquitiLogo";

// Main app component that handles the overall layout and routing.
// Manages device data, view modes, search, and filters.
// Routes between the device list and individual device details.
const App = () => {
  const { devices, loading, error, refetch } = useDevices();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const navigate = useNavigate();
  const location = useLocation();

  const {
    query,
    productLineFilter,
    fullyFilteredDevices,
    setQuery,
    setProductLineFilter,
  } = useDeviceFilters(devices);

  useEffect(() => {
    document.title =
      "Kevin Davis | Ubiquiti Viewer" + (query.trim() ? ` - ${query}` : "");
  }, [query, location]);

  // Helper function to build search params string
  const buildSearchParams = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (productLineFilter.length > 0)
      params.set("lines", productLineFilter.join(","));
    return params.toString();
  };

  // Handle logo click to reset filters and go home
  const handleLogoClick = () => {
    navigate("/");
    setQuery("");
    setProductLineFilter([]);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span>
          <button
            onClick={handleLogoClick}
            className={styles.logoButton}
            aria-label="Go to home and reset filters"
          >
            <UbiquitiLogo />
          </button>
          <h1 className={styles.title}>Devices</h1>
        </span>
        <a
          href="https://github.com/modernkd/ubiquiti-viewer"
          className={styles.authorLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Kevin Davis
        </a>
      </header>
      <div className={styles.container}>
        <div className={styles.content}>
          {loading && <LoadingSpinner />}

          {error && <ErrorMessage message={error} onRetry={refetch} />}

          {devices && !loading && !error && (
            <>
              <Routes>
                <Route
                  path="/"
                  element={
                    <div id="main-content">
                      <div id="search">
                        <DeviceToolbar
                          globalFilter={query}
                          setGlobalFilter={setQuery}
                          viewMode={viewMode}
                          setViewMode={setViewMode}
                          totalDevices={fullyFilteredDevices.length}
                          productLineFilter={productLineFilter}
                          setProductLineFilter={setProductLineFilter}
                          devices={fullyFilteredDevices}
                        />
                      </div>
                      <DeviceView
                        viewMode={viewMode}
                        filtered={fullyFilteredDevices}
                        onOpen={(d: Device) => {
                          const params = buildSearchParams();
                          navigate(
                            `/devices/${encodeURIComponent(d.id)}${
                              params ? `?${params}` : ""
                            }`
                          );
                        }}
                      />
                    </div>
                  }
                />

                <Route path="/devices/:id" element={<DeviceDetailRoute />} />
              </Routes>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
