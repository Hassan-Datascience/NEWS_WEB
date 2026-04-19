"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Fintech", value: 42.8 },
  { name: "Gen AI", value: 38.2 },
  { name: "Web3", value: 21.5 },
  { name: "Robotics", value: 15.9 },
  { name: "Quantum", value: 12.1 },
];

export default function SectorDistribution() {
  return (
    <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-xl p-8">
      <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
        Sector Distribution
      </h3>
      <p className="text-sm text-on-surface-variant mb-8">
        Article volume by intelligence node
      </p>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#424754" opacity={0.1} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#e2e2eb", fontWeight: "bold" }}
              width={80}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: "#1e1f26",
                borderColor: "#424754",
                borderRadius: "8px",
                color: "#e2e2eb",
              }}
            />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              barSize={12}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`rgba(173, 198, 255, ${1 - index * 0.15})`} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-10 p-4 rounded-xl bg-surface-container-high/50 border border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-tertiary/10 rounded-lg">
            <span className="material-symbols-outlined text-tertiary">insights</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">Trend Insight</p>
            <p className="text-[0.625rem] text-on-surface-variant">
              Gen AI volume increased 12% in the last 24h.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
