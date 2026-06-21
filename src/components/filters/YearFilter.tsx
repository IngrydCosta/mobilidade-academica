type YearFilterProps = {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
};

function YearFilter({
  value,
  onChange,
  label = "Ano",
}: YearFilterProps) {
  const startYear = 2020;
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => String(currentYear - i)
  );

  return (
    <div className="flex flex-col w-full">
      <label className="text-[#404c4e] font-medium text-md">
        {label}
      </label>

      <div className="bg-[#F8FAFC] border border-gray-300 rounded-md p-2 mr-5 w-full">
        <select
          id="year"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="cursor-pointer text-[#2b2e2e] bg-transparent outline-none w-full"
        >
           <option value="">Selecione um ano</option>

          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default YearFilter;