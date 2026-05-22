export type Column = {
  className: string;
  header: string;
  accessor: keyof MobilityData;
  
};

type MobilityData = {
  universidade: string;
  pais: string;
  ano: number;
  enviados: number;
  recebidos: number;
  total: number;
};

type TableProps = {
  columns: Column[];
  data: MobilityData[];
  className?:string;
};


function Table({columns, data, className}: TableProps) {



  return (
   <div className= {`overflow-x-auto  border border-gray-300 bg-white shadow-md ${className}`}>
      
       <table className="w-full border-collapse text-left">

        <thead className="bg-[#F3F6F8] text-[#404c4e]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="p-4"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50 ">
              {columns.map((column) => (
                <td
                  key={column.accessor}
                   className={`p-4 ${column.className || ""}`}
                >
                  {item[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}

export default Table