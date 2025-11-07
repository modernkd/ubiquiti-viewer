import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDevices } from "../../hooks/useDevices";
import { LoadingSpinner } from "../LoadingSpinner";
import { ErrorMessage } from "../ErrorMessage";
import { DeviceDetails } from "./DeviceDetails";

/**
 * DeviceDetailRoute
 * Loads the full devices list via the same endpoint as home (useDevices),
 * filters to the requested device by canonical id, and renders DeviceDetails.
 */
export const DeviceDetailRoute: React.FC = () => {
  const params = useParams();
  const routeId = params.id ? decodeURIComponent(params.id) : "";
  const { devices, loading, error, refetch } = useDevices();

  const device = useMemo(
    () => devices?.find((d) => String(d.id) === String(routeId)),
    [devices, routeId]
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!devices || devices.length === 0) {
    return <ErrorMessage message="No devices available" onRetry={refetch} />;
  }
  if (!device) {
    return <ErrorMessage message="Device not found" />;
  }

  return <DeviceDetails device={device} />;
};
