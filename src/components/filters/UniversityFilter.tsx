import { useEffect, useState } from "react";
import axios from "axios";

type University = {
  id: string;
  nome: string;
};

type UniversityFilterProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function UniversityFilter({ value, onChange, disabled = false }: UniversityFilterProps) {
  const [universities, setUniversities] = useState<University[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function load() {
      try {
        const resposta = await axios.get("http://localhost:3333/university", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUniversities(resposta.data);
      } catch (error) {
        console.error("Erro ao carregar universidades", error);
      }
    }

    load();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <label className="text-[#404c4e] font-medium text-md">
        Universidade
      </label>

      <div className={`w-full bg-[#F8FAFC] border border-gray-300 rounded-md p-2 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`text-[#2b2e2e] bg-transparent outline-none w-full ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <option value="">Selecione</option>

          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}