import { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import type { Device } from "../../types/device";
import { LoadingSpinner } from "../LoadingSpinner";
import { ErrorMessage } from "../ErrorMessage";

// Lazy load device details to optimize bundle size
const DeviceOpenComponent = lazy(() =>
  import("./DeviceOpen").then((module) => ({
    default: module.DeviceOpen,
  }))
);

/**
 * Props for the DeviceDetailRoute component.
 */
interface DeviceDetailRouteProps {
  /** All available devices */
  devices?: Device[];
  /** Filtered devices for navigation context */
  filteredDevices?: Device[];
  /** Loading state */
  loading: boolean;
  /** CSS class name for styling */
  className?: string;
  /** Function to build search params string */
  buildSearchParams: () => string;
  /** Navigation callback */
  onNavigate: (deviceId?: string, params?: string) => void;
  /** Retry callback for error states */
  onRetry: (type: 'notFound' | 'error') => void;
}

/**
 * Device detail route component - handles individual device pages
 * Uses filtered devices for navigation context (prev/next buttons)
 */
export const DeviceDetailRoute = ({
  devices,
  filteredDevices,
  loading,
  className,
  buildSearchParams,
  onNavigate,
  onRetry,
}: DeviceDetailRouteProps) => {
  const params = useParams();
  const id = params.id ? decodeURIComponent(params.id) : "";

  if (loading) return <LoadingSpinner />;

  if (!devices || devices.length === 0) {
    return (
      <div className={className}>
        <ErrorMessage
          message={"No devices available"}
          onRetry={() => onRetry('error')}
        />
      </div>
    );
  }

  const device = filteredDevices?.find((d) => d.id === id || d.sysid === id);
  if (!device) {
    // Device might not be in filtered results due to active filters
    return (
      <div className={className}>
        <ErrorMessage
          message={"Device not found"}
          onRetry={() => onRetry('notFound')}
        />
      </div>
    );
  }

  return (
    <Suspense
      fallback={<LoadingSpinner message="Loading device details..." />}
    >
      <DeviceOpenComponent
        device={device}
        filteredDevices={filteredDevices}
        onClose={() => {
          const params = buildSearchParams();
          onNavigate(undefined, params);
        }}
        onPrevious={() => {
          const currentIndex =
            filteredDevices?.findIndex((d) => d.id === device.id) ?? -1;
          if (currentIndex > 0) {
            const prevDevice = filteredDevices![currentIndex - 1];
            const params = buildSearchParams();
            onNavigate(prevDevice.id, params);
          }
        }}
        onNext={() => {
          const currentIndex =
            filteredDevices?.findIndex((d) => d.id === device.id) ?? -1;
          if (
            currentIndex >= 0 &&
            currentIndex < (filteredDevices?.length ?? 0) - 1
          ) {
            const nextDevice = filteredDevices![currentIndex + 1];
            const params = buildSearchParams();
            onNavigate(nextDevice.id, params);
          }
        }}
      />
    </Suspense>
  );
};