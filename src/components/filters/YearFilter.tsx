type YearFilter ={
  value:string
  onChange: (value: string) => void;
}


function YearFilter({value, onChange}: YearFilter) {



  return (
   <div className="flex flex-col w-full">
        <label htmlFor="year" className="text-[#404c4e] font-medium text-md">Ano</label>
        <div className="bg-[#F8FAFC] border border-gray-300 rounded-md p-2 mr-5 w-full">
                <select name="year" id="year" value={value} onChange={(e) => onChange(e.target.value)} 
                className="cursor-pointer text-[#2b2e2e] bg-transparent outline-none w-full">
                    <option value="">Todos</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2021</option>
                </select>
        </div>
        
    </div>
  )
}

export default YearFilter









 
 