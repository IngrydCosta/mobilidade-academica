type StudentNumberInputProps = {
  label: string;
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  disabled?: boolean;
};

function StudentNumberInput({
  label,
  value,
  onChange,
  readOnly = false,
  disabled = false,
}: StudentNumberInputProps) {
  const isLocked = readOnly || disabled;

  return (
    <div className="flex flex-col flex-1">
      <label className="text-[#404c4e] font-medium text-md">{label}</label>
      <div
        className={`border border-gray-300 rounded-md p-2 mr-5 w-full ${
          isLocked ? "bg-gray-100 cursor-not-allowed opacity-80" : "bg-[#F8FAFC]"
        }`}
      >
        <input
          type="number"
          value={value}
          readOnly={isLocked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(Number(e.target.value))}
          className={`text-[#2b2e2e] bg-transparent outline-none w-full font-semibold ${
            isLocked ? "cursor-not-allowed text-gray-700" : "cursor-pointer"
          }`}
        />
      </div>
    </div>
  );
}

export default StudentNumberInput;
