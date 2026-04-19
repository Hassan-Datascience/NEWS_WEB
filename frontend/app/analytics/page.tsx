import { getSummary } from "@/lib/api";
import SummaryCards from "@/components/analytics/SummaryCards";
import SentimentVelocityChart from "@/components/analytics/SentimentVelocityChart";
import SectorDistribution from "@/components/analytics/SectorDistribution";

export const revalidate = 60;

export default async function AnalyticsPage() {
  const summary = await getSummary().catch(() => null);

  return (
    <main className="pt-28 pl-72 pr-8 pb-12 min-h-screen">
      <div className="flex items-center gap-6 mb-8">
        <h1 className="font-['Manrope'] text-2xl font-black text-[#e2e2eb] tracking-tight">
          Analytics
        </h1>
        <div className="h-6 w-[1px] bg-outline-variant/30"></div>
        <span className="font-['Manrope'] font-semibold text-lg text-[#adc6ff]">
          Market Intelligence
        </span>
      </div>

      {summary && <SummaryCards summary={summary} />}

      <div className="grid grid-cols-12 gap-6">
        <SentimentVelocityChart />
        <SectorDistribution />

        {/* Anomalous Activity Detection Table */}
        <div className="col-span-12 bg-surface-container-low rounded-xl overflow-hidden mt-6">
          <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="font-headline text-lg font-bold text-on-surface">
              Anomalous Activity Detection
            </h3>
            <button className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
              View Full Log
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-high/30">
                <tr>
                  <th className="px-8 py-4 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
                    Node Source
                  </th>
                  <th className="px-8 py-4 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
                    Entity Status
                  </th>
                  <th className="px-8 py-4 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
                    Sentiment Shift
                  </th>
                  <th className="px-8 py-4 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
                    Time Code
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {[
                  {
                    source: "Reuters Finance Feed",
                    status: "Bullish Surge",
                    shift: "+0.24 (Rapid)",
                    time: "2m ago",
                    icon: "hub",
                    statusColor: "bg-tertiary-container text-on-tertiary-container",
                    shiftColor: "text-tertiary",
                  },
                  {
                    source: "GitHub Trends Aggregator",
                    status: "Neutral Stable",
                    shift: "0.00 (Flat)",
                    time: "14m ago",
                    icon: "terminal",
                    statusColor: "bg-secondary-container text-on-secondary-container",
                    shiftColor: "text-on-surface-variant",
                  },
                  {
                    source: "CryptoWatch Pro",
                    status: "Bearish Pivot",
                    shift: "-0.18 (Moderate)",
                    time: "28m ago",
                    icon: "rss_feed",
                    statusColor: "bg-error-container text-on-error-container",
                    shiftColor: "text-error",
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-high/20 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">{row.icon}</span>
                        </div>
                        <span className="text-sm font-semibold text-on-surface">{row.source}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-full text-[0.625rem] font-black uppercase tracking-wider ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className={`px-8 py-5 text-sm font-mono ${row.shiftColor}`}>
                      {row.shift}
                    </td>
                    <td className="px-8 py-5 text-sm text-on-surface-variant">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
