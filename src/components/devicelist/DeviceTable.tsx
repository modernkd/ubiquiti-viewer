import React from "react";
import { memo } from "react";
import type { Table } from "@tanstack/react-table";
import type { Device } from "../../types/device";
import { DeviceIcon } from "../DeviceIcon";
import styles from "./DeviceList.module.css";

/**
 * Props for the DeviceTable component.
 */
interface DeviceTableProps {
  /**
   * The TanStack table instance containing device data and configuration.
   */
  table: Table<Device>;
  /**
   * Callback function called when a device row is clicked.
   */
  onOpen?: (device: Device) => void;
}

/**
 * DeviceTable component that renders a sortable table of devices using TanStack Table.
 *
 * This component displays device data in a tabular format with:
 * - Sortable column headers with visual indicators
 * - Device icons in the first column
 * - Custom rendering for model data using device transformers
 * - Responsive table styling
 *
 * @param props - The component props
 * @param props.table - Configured TanStack table instance with device data
 *
 * @example
 * ```tsx
 * const table = useReactTable({
 *   data: devices,
 *   columns: deviceColumns,
 *   // ... other table config
 * });
 *
 * <DeviceTable table={table} />
 * ```
 */
export const DeviceTable: React.FC<DeviceTableProps> = memo(
  ({ table, onOpen }) => {
    return (
      <table className={styles.deviceTable}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={styles.headerCell}>
                  {header.isPlaceholder
                    ? null
                    : (header.column.columnDef.header as string)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onOpen?.(row.original)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpen?.(row.original);
                }
              }}
              tabIndex={0}
              className={styles.tableRow}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={styles.tableCell}>
                  {cell.column.id === "icon" ? (
                    <DeviceIcon
                      device={row.original}
                      className={styles.deviceIcon}
                    />
                  ) : (
                    (cell.getValue() as React.ReactNode)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
);
