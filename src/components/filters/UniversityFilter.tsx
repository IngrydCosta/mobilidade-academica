import { useState } from "react"



function UniversityFilter() {

const[universityFilter, setUniversityFilter] = useState("")

  return (
    <div className="flex flex-col flex-1">
        <label htmlFor="university" className="text-[#404c4e] font-medium text-md">Universidade</label>
        <div className="bg-[#F8FAFC] border border-gray-300 rounded-md p-2 mr-5">
                <select name="university" id="university" value={universityFilter} onChange={(e) => setUniversityFilter(e.target.value)} 
                className="cursor-pointer text-[#2b2e2e] bg-transparent outline-none w-full">
                    <option value="">Todos</option>
                    <option value="Universidade de Lisboa">Universidade de Lisboa</option>
                    <option value="Universidade de Coimbra">Universidade de Coimbra</option>
                    <option value="Sorbonne Université">Sorbonne Université</option>
                    <option value="Universidad de Barcelona">Universidad de Barcelona</option>
                    <option value="Sapienza Universitá">Sapienza Universitá</option>
                    <option value="Ludwig-Maximilians-Universität">Ludwig-Maximilians-Universität</option>
                </select>
        </div>
        
    </div>
  )
}

export default UniversityFilter