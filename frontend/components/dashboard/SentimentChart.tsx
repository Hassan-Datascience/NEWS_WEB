"use client";

import { useState, useEffect } from "react";
import { Summary } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function SentimentChart({ summary }: { summary: Summary }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!summary) return null;

  const data = [
    { name: "Positive", value: summary.positive_count, color: "#4cd7f6" },
    { name: "Negative", value: summary.negative_count, color: "#ffb4ab" },
    { name: "Neutral", value: summary.neutral_count, color: "#3a4a5f" },
  ];

  const posPct = summary.total_articles > 0 ? ((summary.positive_count / summary.total_articles) * 100).toFixed(0) : 0;
  const negPct = summary.total_articles > 0 ? ((summary.negative_count / summary.total_articles) * 100).toFixed(0) : 0;
  const neuPct = summary.total_articles > 0 ? ((summary.neutral_count / summary.total_articles) * 100).toFixed(0) : 0;

  return (
    <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 rounded-xl flex flex-col justify-between">
      <h2 className="text-xl font-headline font-bold text-on-surface mb-6">
        Sentiment Distribution
      </h2>
      <div className="relative mx-auto flex items-center justify-center" style={{ width: '100%', height: 240 }}>
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={65}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                cornerRadius={4}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        )}
        <div className="absolute text-center pointer-events-none">
          <div className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">
            Score
          </div>
          <div className="text-2xl font-black font-headline text-on-surface">
            {summary?.avg_score?.toFixed(1) ?? '—'}
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-tertiary"></div>
            <span className="text-xs text-on-surface font-medium">Positive</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant">{posPct}%</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-error"></div>
            <span className="text-xs text-on-surface font-medium">Negative</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant">{negPct}%</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-secondary-container"></div>
            <span className="text-xs text-on-surface font-medium">Neutral</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant">{neuPct}%</span>
        </div>
      </div>
    </div>
  );
}
