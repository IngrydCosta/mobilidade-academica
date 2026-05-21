
import { useState } from "react"


function CountryFilter() {

    const[countryFilter, setCountryFilter] = useState("")

  return (
     <div className="flex flex-col flex-1">
        <label htmlFor="country" className="text-[#404c4e] font-medium text-md">País</label>
        <div className="bg-[#F8FAFC] border border-gray-300 rounded-md p-2 mr-5">
                <select name="university" id="university" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} 
                className="cursor-pointer text-[#2b2e2e] bg-transparent outline-none w-full">
                    <option value="">Todos</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Franca">França</option>
                    <option value="Alemanha">Alemanha</option>
                    <option value="Espanha">Espanha</option>
                    <option value="Italia">Itália</option>
                    <option value="Espanha">Espanha</option>
                </select>
        </div>
        
    </div>
  )
}

export default CountryFilter






