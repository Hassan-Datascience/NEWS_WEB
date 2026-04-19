"use client";

import { useState, useEffect } from "react";
import { DailyCount } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
export default function ArticlesOverTime({
  data = [],
}: {
  data?: DailyCount[];
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use real data from API or show empty state
  const chartData = data.length > 0 ? data : [];

  return (
    <div className="col-span-12 lg:col-span-8 bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-xl font-headline font-bold text-on-surface">
            Articles per day (last 7 days)
          </h2>
          <p className="text-sm text-on-surface-variant/60">
            Recent activity tracking
          </p>
        </div>
        <div className="flex space-x-2">
          <span className="px-3 py-1 bg-surface-container-high rounded-lg text-xs font-bold text-primary">
            Articles
          </span>
        </div>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%">
            {chartData.length > 0 ? (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#424754" vertical={false} opacity={0.3} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "rgba(194, 198, 214, 0.4)", fontWeight: "bold" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "rgba(194, 198, 214, 0.4)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1f26",
                    borderColor: "#424754",
                    borderRadius: "8px",
                    color: "#e2e2eb",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#adc6ff" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#adc6ff"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#adc6ff", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#4d8eff", stroke: "#111319", strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-on-surface-variant/40 italic">
                No data available
              </div>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
