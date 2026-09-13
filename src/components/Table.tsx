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
  itemsPerPage?: number;
};

function Table<T extends Record<string, unknown>>({
  columns,
  data,
  className,
  itemsPerPage = 8,
}: TableProps<T>) {
  const emptyRows = itemsPerPage - data.length;

  return (
    <div
      className={`overflow-x-auto border border-gray-300 bg-white shadow-md min-h-[405px] ${className || ""}`}
    >
      <table className="w-full border-collapse text-left text-sm table-fixed">
        <thead className="bg-[#F3F6F8] text-[#404c4e]">
          <tr className="h-[45px]">
            {columns.map((column) => (
              <th key={column.header} className={`p-3 whitespace-nowrap ${column.className || ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr className="h-[360px]">
              <td colSpan={columns.length} className="p-4 text-center text-gray-500 align-middle">
                Nenhum registo encontrado.
              </td>
            </tr>
          ) : (
            <>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 h-[45px] box-border"
                >
                  {columns.map((column) => {
                    const val = "render" in column && column.render
                      ? column.render(item)
                      : String(item[column.accessor as keyof T] ?? "-");
                    const titleText = typeof val === "string" ? val : undefined;

                    return (
                      <td
                        key={column.header}
                        className={`p-3 whitespace-nowrap truncate max-w-0 ${column.className || ""}`}
                        title={titleText}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {emptyRows > 0 &&
                Array.from({ length: emptyRows }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className="border-b border-gray-100 h-[45px]">
                    {columns.map((column) => (
                      <td key={column.header} className="p-3 whitespace-nowrap">
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;