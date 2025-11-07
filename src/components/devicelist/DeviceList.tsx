import React from "react";
import { Link } from "react-router-dom";
import { type Device } from "../../types/device";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import { DeviceTable } from "./DeviceTable";
import { DeviceIcon } from "../DeviceIcon";
import styles from "./DeviceList.module.css";

// Props for the DeviceList component
interface DeviceListProps {
  devices: Device[];
  onOpen?: (device: Device) => void;
}

// DeviceList component that displays a sortable table of Ubiquiti devices
export const DeviceList: React.FC<DeviceListProps> = ({ devices, onOpen }) => {
  const columns: ColumnDef<Device>[] = [
    {
      id: "icon",
      header: "",
      cell: ({ row }) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <DeviceIcon device={row.original} context="medium" lazy={true} />
        </div>
      ),
      size: 52,
      enableSorting: false,
    },
    {
      accessorKey: "line.name",
      header: "Product Line",
      cell: ({ getValue }) => (
        <div
          style={{
            color: "var(--text-2-light)",
            fontSize: 14,
            fontFamily: "UI Sans_v7",
            fontWeight: "400",
            lineHeight: 20,
          }}
        >
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "product.name",
      header: "Name",
      cell: ({ getValue, row }) => (
        <div
          style={{
            color: "var(--text-3-light)",
            fontSize: 14,
            fontFamily: "UI Sans_v7",
            fontWeight: "400",
            lineHeight: 20,
          }}
        >
          <Link
            to={`/devices/${encodeURIComponent(row.original.id)}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {getValue() as string}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ getValue }) => (
        <div
          style={{
            color: "var(--text-2-light)",
            fontSize: 14,
            fontFamily: "UI Sans_v7",
            fontWeight: "400",
            lineHeight: 20,
          }}
        >
          {getValue() as string}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: devices,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.deviceList}>
      <DeviceTable table={table} onOpen={onOpen} />
    </div>
  );
};
