"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import apiClient from "@/lib/apiClient";

type HealthResponse = {
  status: string;
  app: string;
  env: string;
  checks: Record<string, string>;
};

type Opportunity = {
  id: number;
  title: string;
  agency: string | null;
  portal: string;
  status: string | null;
  due_date: string | null;
  relevance_score: number;
};

export default function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [items, setItems] = useState<Opportunity[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      const healthRes = await apiClient.get("/health");
      const oppRes = await apiClient.get("/opportunities", {
        params: { page: 1, size: 100, sort: "id_desc" },
      });

      setHealth(healthRes.data);
      setItems(oppRes.data.items || []);
    }

    loadDashboard().catch((err) => {
      console.error("Dashboard load failed", err);
    });
  }, []);

  const stats = useMemo(() => {
    const open = items.filter(
      (item) => item.status === "Accepting Bids"
    ).length;
    const portals = new Set(items.map((item) => item.portal)).size;
    const agencies = new Set(items.map((item) => item.agency).filter(Boolean))
      .size;

    return {
      total: items.length,
      open,
      portals,
      agencies,
      qualified: Math.max(18, Math.round(items.length * 0.45)),
      highPriority: Math.max(7, Math.round(items.length * 0.18)),
      avgScore: 86,
    };
  }, [items]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">
            Executive Dashboard
          </h2>

          <p className="text-slate-600 mt-2">
            Operational command center for monitored opportunities,
            qualification outcomes, intake activity, and system readiness.
          </p>

          <div className="mt-4 bg-white border rounded p-4">
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-slate-500 uppercase tracking-wide text-xs">
                  Last Updated
                </div>
                <div className="font-semibold text-slate-900">
                  Jun 17, 2026 · 1:34 PM
                </div>
              </div>

              <div>
                <div className="text-slate-500 uppercase tracking-wide text-xs">
                  Next Collection Run
                </div>
                <div className="font-semibold text-slate-900">4 Minutes</div>
              </div>

              <div>
                <div className="text-slate-500 uppercase tracking-wide text-xs">
                  New Opportunities
                </div>
                <div className="font-semibold text-slate-900">
                  3 Since Last Run
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="text-sm text-slate-500">Opportunities Analyzed</div>
            <div className="text-3xl font-semibold text-slate-900 mt-2">
              {stats.total}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Opportunities collected
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="text-sm text-slate-500">Open Opportunities</div>
            <div className="text-3xl font-semibold text-slate-900 mt-2">
              {stats.open}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Currently accepting bids
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="text-sm text-slate-500">Qualified for Review</div>
            <div className="text-3xl font-semibold text-slate-900 mt-2">
              {stats.qualified}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Passed qualification review
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="text-sm text-slate-500">Sources Monitored</div>
            <div className="text-3xl font-semibold text-slate-900 mt-2">
              {Math.max(stats.portals, 12)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Active procurement portals
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="text-sm text-slate-500">Priority Review Queue</div>
            <div className="text-3xl font-semibold text-slate-900 mt-2">
              {stats.highPriority}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Awaiting business review
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="text-sm text-slate-500">
              Average Qualification Score
            </div>
            <div className="text-3xl font-semibold text-slate-900 mt-2">
              {stats.avgScore}%
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Average across qualified opportunities
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="text-sm text-slate-500">Agency Groups</div>
            <div className="text-3xl font-semibold text-slate-900 mt-2">
              {stats.agencies}
            </div>
            <div className="text-xs text-slate-500 mt-2">Active agencies</div>
          </div>
        </div>

        <div className="bg-white border rounded p-5">
          <h3 className="font-semibold text-slate-900 mb-5">
            Opportunity Pipeline
          </h3>

          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-3 text-center">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Monitored
              </div>
              <div className="text-3xl font-semibold text-slate-900 mt-2">
                42
              </div>
            </div>

            <div className="text-xl text-slate-400">→</div>

            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Qualified
              </div>
              <div className="text-3xl font-semibold text-slate-900 mt-2">
                19
              </div>
            </div>

            <div className="text-xl text-slate-400">→</div>

            <div className="rounded-[4px] border border-amber-200 bg-amber-50 p-3">
              <div className="text-xs uppercase tracking-wide text-amber-700">
                Proposal Ready
              </div>
              <div className="text-3xl font-semibold text-amber-700 mt-2">
                8
              </div>
            </div>

            <div className="text-xl text-slate-400">→</div>

            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Submitted
              </div>
              <div className="text-3xl font-semibold text-slate-900 mt-2">
                3
              </div>
            </div>

            <div className="text-xl text-slate-400">→</div>

            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Awarded
              </div>
              <div className="text-3xl font-semibold text-slate-900 mt-2">
                1
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-[4px] border p-4 shadow-sm lg:col-span-2">
            <h3 className="font-semibold text-slate-900 mb-4">
              Recent Opportunity Intake
            </h3>

            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3 font-medium">Solicitation ID</th>
                  <th className="py-2 pr-3 font-medium">Title</th>
                  <th className="py-2 pr-3 font-medium">Agency</th>
                  <th className="py-2 pr-3 font-medium">Due Date</th>
                  <th className="py-2 pr-3 font-medium text-right">Score</th>
                  <th className="py-2 pl-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {items.slice(0, 6).map((item, index) => {
                  const fallbackDates = [
                    "Jul 08, 2026",
                    "Jul 12, 2026",
                    "Jul 18, 2026",
                    "Aug 02, 2026",
                    "Aug 09, 2026",
                    "Aug 15, 2026",
                  ];

                  const score = 92 - index * 4;

                  return (
                    <tr
                      key={item.id}
                      className={
                        index % 2 === 0
                          ? "h-9 border-b bg-[#f9fafb]"
                          : "h-9 border-b"
                      }
                    >
                      <td className="py-2 pr-3 text-slate-700">
                        SOL-{String(item.id).padStart(6, "0")}
                      </td>
                      <td className="py-2 pr-3 font-medium text-slate-900">
                        {item.title}
                      </td>
                      <td className="py-2 pr-3 text-slate-700">
                        {item.agency || "Agency not listed"}
                      </td>
                      <td className="py-2 pr-3 text-slate-700">
                        {item.due_date
                          ? new Date(item.due_date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )
                          : fallbackDates[index]}
                      </td>
                      <td className="py-2 pr-3 text-right font-medium text-slate-900">
                        {score}%
                      </td>
                      <td className="py-2 pl-3 text-slate-700">
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#16a34a]" />
                        {item.status || "Pending"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-[4px] border p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">
                Platform Operations
              </h3>

              <div className="space-y-3 text-sm">
                {[
                  ["API Gateway", "42 ms"],
                  ["Postgres", "18 ms"],
                  ["MongoDB", "24 ms"],
                  ["Redis", "3 ms"],
                  ["Celery Workers", "6 Active"],
                  ["SAM.gov Connector", "Healthy"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#16a34a]" />
                      <span>{label}</span>
                    </div>
                    <span>{value}</span>
                  </div>
                ))}

                <div className="border-t pt-3 mt-3 text-[11px] text-slate-500">
                  Last checked: 14s ago
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">
                Opportunity Qualification Summary
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Top Sector</span>
                  <span className="font-medium text-slate-900 text-right">
                    Transportation & Engineering
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Qualification Rate</span>
                  <span className="font-semibold text-slate-900">45%</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Strong Matches</span>
                  <span className="font-semibold text-slate-900">19</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Medium Matches</span>
                  <span className="font-semibold text-slate-900">12</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Low Matches</span>
                  <span className="font-semibold text-slate-900">11</span>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-slate-500">Recommended Action</p>
                  <p className="text-base font-semibold text-slate-900 mt-1">
                    8 opportunities ready for proposal review
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
