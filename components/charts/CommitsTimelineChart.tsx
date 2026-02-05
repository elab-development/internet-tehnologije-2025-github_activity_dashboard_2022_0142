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

type ViewMode = "daily" | "weekly" | "yearly";

interface StatsData {
  daily: { day: number; count: number }[];
  weekly: { week: number; count: number }[];
  yearly: { label: string; count: number }[];
}

export default function CommitsTimelineChart({ 
  data, 
  loading 
}: { 
  data: StatsData | null; 
  loading: boolean;
}) {
  const [view, setView] = useState<ViewMode>("weekly");

  const chartData = useMemo(() => {
    if (!data || loading) return [];

    if (view === "yearly") {
      return data.yearly.map(item => ({
        label: item.label,
        commits: item.count
      }));
    }

    if (view === "weekly") {
      return data.weekly.map((item, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (51 - index) * 7);
        return {
          label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          commits: item.count
        };
      });
    }

    if (view === "daily") {
      return data.daily.map((item, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (data.daily.length - 1 - index));
        return {
          label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          commits: item.count
        };
      });
    }

    return [];
  }, [data, view, loading]);

  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center text-sm text-amber-600 bg-gray-50 border border-dashed border-gray-200">
        <span className="animate-pulse">Gathering commit history...</span>
      </div>
    );
  }

  return (
    <div >
      <div className="flex items-center justify-between mb-6">
        <select 
          value={view}
          onChange={(e) => setView(e.target.value as ViewMode)}
        className="text-xs border border-gray-800 p-2 outline-none w-full max-w-xs bg-white cursor-pointer rounded-none disabled:opacity-50">
          <option value="daily">Last Month (Daily)</option>
          <option value="weekly">Last Year (Weekly)</option>
          <option value="yearly">All Time (Yearly)</option>
        </select>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#9ca3af' }}
            />
            <Tooltip 
              cursor={{ fill: "#f9fafb" }}
              contentStyle={{ 
                fontSize: '12px', 
                borderRadius: '6px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }} 
            />
            <Bar 
              dataKey="commits" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}