import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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

function Grafico() {
  return (
    <div className="bg-white p-6 rounded-xl h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="ano" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="enviados"
            stroke="#173764"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="recebidos"
            stroke="#D9A95E"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Grafico;