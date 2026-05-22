
type StudentNumberInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function StudentNumberInput({label, value, onChange}: StudentNumberInputProps) {


  return (
     <div className="flex flex-col flex-1">
        <label htmlFor="sentStudent" className="text-[#404c4e] font-medium text-md">{label}</label>
        <div className="bg-[#F8FAFC] border border-gray-300 rounded-md p-2 mr-5">
                <input type="number"  value={value} onChange={(e) => onChange(Number(e.target.value)) }
                className="cursor-pointer text-[#2b2e2e] bg-transparent outline-none w-full"/>
                
        </div>
        
    </div>
  )
}

export default StudentNumberInput


