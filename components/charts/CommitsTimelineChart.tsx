"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ViewMode = "monthly" | "yearly" | "all-time";

export default function CommitsTimelineChart({ data }: { data: any }) {
  const [view, setView] = useState<ViewMode>("monthly");

  const chartData = useMemo(() => {
    if (!data || data.pending || !Array.isArray(data)) return [];

    const groups: Record<string, number> = {};

    data.forEach((item) => {
      const d = new Date(item.date);
      let key = "";

      if (view === "yearly") {
        key = d.getFullYear().toString();
      } else if (view === "monthly") {
        key = d.toLocaleString("en-US", { month: "short", year: "numeric" });
      } else {
        key = item.date;
      }

      groups[key] = (groups[key] || 0) + item.commits;
    });

    return Object.entries(groups)
      .map(([label, commits]) => ({ label, commits }))
      .sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime());
  }, [data, view]);

  if (data?.pending) {
    return (
      <div className="h-72 flex items-center justify-center text-sm text-amber-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4">
      <div className="flex justify-end mb-4">
        <select 
          value={view}
          onChange={(e) => setView(e.target.value as ViewMode)}
          className="text-xs border border-gray-200 bg-gray-50 px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium text-gray-700"
        >
          <option value="monthly">Monthly View</option>
          <option value="yearly">Yearly View</option>
          <option value="all-time">All Time</option>
        </select>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="label" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: "#f3f4f6" }}
              contentStyle={{ fontSize: '12px', borderRadius: '8px' }} 
            />
            <Bar dataKey="commits" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}