type SemesterFilterProps = {
  value?: string | number;
  onChange: (value: string) => void;
  label?: string;
};

function SemesterFilter({
  value,
  onChange,
  label = "Semestre",
}: SemesterFilterProps) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-[#404c4e] font-medium text-md">
        {label}
      </label>

      <div className="bg-[#F8FAFC] border border-gray-300 rounded-md p-2 mr-5 w-full">
        <select
          id="semester"
          value={value ? String(value) : ""}
          onChange={(e) => onChange(e.target.value)}
          className="cursor-pointer text-[#2b2e2e] bg-transparent outline-none w-full"
        >
          <option value="">Selecione um semestre</option>
          <option value="1">1º Semestre</option>
          <option value="2">2º Semestre</option>
        </select>
      </div>
    </div>
  );
}

export default SemesterFilter;
