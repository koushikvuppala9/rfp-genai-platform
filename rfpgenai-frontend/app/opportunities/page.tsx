'use client';

import { useEffect, useMemo, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import apiClient from '@/lib/apiClient';

type Opportunity = {
  id: number;
  title: string;
  agency: string;
  portal: string;
  status: string;
  due_date: string;
  relevance_score: number;
  source_url: string;
  first_seen_at?: string;
};

export default function OpportunitiesPage() {
  const [data, setData] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize) || 1;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const res = await apiClient.get('/opportunities', {
          params: {
            page,
            size: pageSize,
            sort: 'id_desc',
          },
        });

        setData(res.data.items || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      const matchesSearch =
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.agency?.toLowerCase().includes(search.toLowerCase()) ||
        item.portal?.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [data, statusFilter, search]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Opportunity Inbox</h2>

          <p className="text-sm text-slate-600 mt-1">
            Active procurement opportunities collected from monitored sources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-4">
            <div className="text-xs text-slate-500 uppercase">Opportunities</div>

            <div className="text-3xl font-semibold mt-2">{total}</div>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <div className="text-xs text-slate-500 uppercase">Current Page</div>

            <div className="text-3xl font-semibold mt-2">{page}</div>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <div className="text-xs text-slate-500 uppercase">Data Sources</div>

            <div className="text-3xl font-semibold mt-2">
              {new Set(data.map((x) => x.portal)).size}
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Search opportunities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full md:w-96"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-4 py-2 rounded-lg ${
                  statusFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100'
                }`}
              >
                All
              </button>

              <button
                onClick={() => setStatusFilter('Accepting Bids')}
                className={`px-4 py-2 rounded-lg ${
                  statusFilter === 'Accepting Bids' ? 'bg-slate-900 text-white' : 'bg-slate-100'
                }`}
              >
                Open
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-6">Loading opportunities...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-600">
                  <th className="p-4">Opportunity</th>
                  <th className="p-4">Agency</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Link</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item) => {
                  const dueDate = item.due_date ? new Date(item.due_date) : null;

                  return (
                    <tr key={item.id} className="border-t hover:bg-slate-50">
                      <td className="p-4 font-medium text-slate-900">{item.title}</td>

                      <td className="p-4 text-slate-700">{item.agency}</td>

                      <td className="p-4 text-slate-600">{item.portal}</td>

                      <td className="p-4">
                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
                          {item.status}
                        </span>
                      </td>

                      <td className="p-4 text-red-600 font-medium">
                        {dueDate ? dueDate.toLocaleDateString() : '-'}
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-1 rounded bg-slate-100">
                          {item.relevance_score}
                        </span>
                      </td>

                      <td className="p-4">
                        <a
                          href={item.source_url}
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-slate-100 rounded-lg"
          >
            Previous
          </button>

          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-slate-100 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </AppShell>
  );
}
