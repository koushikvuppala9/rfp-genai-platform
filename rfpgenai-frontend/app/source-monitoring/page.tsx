export default function SourceMonitoringPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Source Monitoring</h1>
        <p className="mt-2 text-sm text-slate-600">
          Monitor procurement source availability, sync status, and ingestion health.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Source status</h2>
        <p className="mt-2 text-sm text-slate-600">
          Source monitoring dashboard will show SAM.gov, state portals, sync history,
          failures, and last successful ingestion times.
        </p>
      </section>
    </main>
  );
}
