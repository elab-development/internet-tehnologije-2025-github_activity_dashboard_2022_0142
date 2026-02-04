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

// Mapping the ViewMode to the keys returned by your new API logic
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

    // 'yearly' uses { label, count } from the Search API logic
    if (view === "yearly") {
      return data.yearly.map(item => ({
        label: item.label,
        commits: item.count
      }));
    }

    // 'weekly' uses the index-based data from Stats API
    if (view === "weekly") {
      return data.weekly.map(item => ({
        label: `Week ${item.week + 1}`,
        commits: item.count
      }));
    }

    // 'daily' logic (last 30 days)
    if (view === "daily") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return data.daily.map(item => ({
        label: days[item.day],
        commits: item.count
      }));
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
    <div className="w-full bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-900">Commit Activity</h3>
        <select 
          value={view}
          onChange={(e) => setView(e.target.value as ViewMode)}
          className="text-xs border border-gray-200 bg-gray-50 px-3 py-1.5 rounded outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium text-gray-700 transition-all"
        >
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
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
              barSize={view === 'yearly' ? 40 : undefined}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}