import type { ReactNode } from 'react';

// Generic table with a typed column definition.
// `key` must be a keyof T (or 'actions' for the trailing cell).
export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  empty?: ReactNode;
  onRowHover?: boolean;
}

export default function Table<T>({ columns, data, rowKey, empty }: TableProps<T>) {
  if (data.length === 0) {
    return <>{empty ?? null}</>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 ${
                  col.headerClassName ?? ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={rowKey(row)} className="border-b border-gray-100 last:border-0 transition-colors hover:bg-brand-greenSoft">
              {columns.map((col) => (
                <td key={col.key} className={`whitespace-nowrap px-4 py-3 text-black ${col.className ?? ''}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
