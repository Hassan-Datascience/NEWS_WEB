"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SentimentVelocityChart() {
  // Dummy data based on the SVG path in the HTML
  const data = [
    { time: "00:00", velocity: 250 },
    { time: "02:00", velocity: 220 },
    { time: "04:00", velocity: 240 },
    { time: "06:00", velocity: 180 },
    { time: "08:00", velocity: 190 },
    { time: "10:00", velocity: 140 },
    { time: "12:00", velocity: 150 },
    { time: "14:00", velocity: 100 },
    { time: "16:00", velocity: 120 },
    { time: "18:00", velocity: 80 },
    { time: "20:00", velocity: 100 },
    { time: "22:00", velocity: 60 },
    { time: "23:59", velocity: 30 },
  ];

  return (
    <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="font-headline text-lg font-bold text-on-surface">
            Sentiment Velocity
          </h3>
          <p className="text-sm text-on-surface-variant">
            Aggregate market mood across 14 channels
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-surface-container-highest text-xs font-bold font-headline uppercase tracking-wider text-primary">
            Daily
          </button>
          <button className="px-3 py-1 rounded hover:bg-surface-container-highest text-xs font-bold font-headline uppercase tracking-wider text-on-surface-variant transition-colors">
            Weekly
          </button>
        </div>
      </div>
      <div className="h-80 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4d8eff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4d8eff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#424754" vertical={false} opacity={0.3} />
            <XAxis
              dataKey="time"
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
            <Area
              type="monotone"
              dataKey="velocity"
              stroke="#adc6ff"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
