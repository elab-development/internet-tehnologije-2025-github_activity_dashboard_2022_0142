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
  daily: { day: string; count: number }[];
  weekly: { week: number; count: number }[];
  yearly: { label: string; count: number }[];
}

export default function CommitsTimelineChart({
  data,
  loading,
}: {
  data: StatsData | null;
  loading: boolean;
}) {
  const [view, setView] = useState<ViewMode>("weekly");

  const chartData = useMemo(() => {
    if (!data || loading) return [];

    if (view === "yearly") {
      return data.yearly.map((item) => ({
        label: item.label,
        commits: item.count,
      }));
    }

    if (view === "weekly") {
      return data.weekly.slice(-12).map((item, index, arr) => {
        const date = new Date();
        date.setDate(date.getDate() - (arr.length - 1 - index) * 7);
        return {
          label: date.toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
          commits: item.count,
        };
      });
    }

    if (view === "daily") {
      return data.daily.map((item) => {
        const [year, month, day] = item.day.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return {
          label: date.toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
          commits: item.count,
        };
      });
    }

    return [];
  }, [data, view, loading]);

  return (
    <div className="w-full bg-white p-4">
      <div className="flex items-center justify-between mb-6">
        <select
          value={view}
          onChange={(e) => setView(e.target.value as ViewMode)}
          disabled={loading}
          className="text-xs border border-gray-800 p-2 outline-none w-full max-w-xs bg-white cursor-pointer rounded-none disabled:opacity-50"
        >
          <option value="daily">Last 30 Days (Daily)</option>
          <option value="weekly">Last 3 Months (Weekly)</option>
          <option value="yearly">All time (Yearly)</option>
        </select>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="label" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: "#9ca3af" }} />
            <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: "#9ca3af" }} />
            <Tooltip
              cursor={{ fill: "#f9fafb" }}
              contentStyle={{ fontSize: "12px", borderRadius: "0px", border: "1px solid #000", boxShadow: "none" }}
            />
            <Bar dataKey="commits" fill="#111827" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}