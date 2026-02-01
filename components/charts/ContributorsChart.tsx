import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ContributorsChart({ data }: { data: any[] }) {
  const dynamicHeight = Math.max(data.length * 40, 400);

  return (
    <div className="w-full bg-white p-4">
      <div className="overflow-y-auto max-h-150">
        <div style={{ height: dynamicHeight, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 40, right: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis type="number" hide /> 
              <YAxis 
                dataKey="author" 
                type="category" 
                tick={{ fontSize: 12 }}
              />
              <Tooltip cursor={{ fill: "#f3f4f6" }} />
              <Bar 
                dataKey="commits" 
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}