import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  {
    ano: "2021",
    enviados: 1200,
    recebidos: 900,
  },
  {
    ano: "2022",
    enviados: 1800,
    recebidos: 1400,
  },
  {
    ano: "2023",
    enviados: 2400,
    recebidos: 2000,
  },
  {
    ano: "2024",
    enviados: 3156,
    recebidos: 2800,
  },
];

function GraficoComparacaoAnual() {
  return (
    <div className="bg-white p-6 rounded-xl h-80">
      <ResponsiveContainer width="100%" height="100%">
        
        <BarChart data={data}>
          
          <XAxis
            dataKey="ano"
            tick={{ fill: "#404c4e" }}
          />

          <YAxis
            tick={{ fill: "#404c4e" }}
          />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="enviados"
            fill="#173764"
            radius={[6, 6, 0, 0]}
            name="Estudantes Enviados"
          />

          <Bar
            dataKey="recebidos"
            fill="#D9A95E"
            radius={[6, 6, 0, 0]}
            name="Estudantes Recebidos"
          />

        </BarChart>

      </ResponsiveContainer>
    </div>
  );
}

export default GraficoComparacaoAnual;