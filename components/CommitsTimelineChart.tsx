import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function CommitsTimelineChart({ data }: { data: any[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <div style={{ width: Math.max(data.length * 24, 800) }}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="commits" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
