import React from "react";

export type Column<T> = {
  className?: string;
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
};

function Table<T extends Record<string, unknown>>({
  columns,
  data,
  className,
}: TableProps<T>) {
  return (
    <div
      className={`overflow-x-auto border border-gray-300 bg-white shadow-md ${className}`}
    >
      <table className="w-full border-collapse text-left">
        <thead className="bg-[#F3F6F8] text-[#404c4e]">
          <tr>
            {columns.map((column) => (
              <th key={column.header} className="p-4">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              {columns.map((column) => (
  <td key={column.header} className={`p-4 ${column.className || ""}`}>
    {"render" in column && column.render
      ? column.render(item)
      : String(item[column.accessor as keyof T] ?? "-")}
  </td>
))}
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;