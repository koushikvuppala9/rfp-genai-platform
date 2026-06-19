import AppShell from "@/components/layout/AppShell";

export default function ProposalWorkspacePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Proposal Workspace</h1>
          <p className="text-slate-600 mt-2">
            AI-assisted proposal generation using opportunity requirements and company knowledge.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <p className="text-sm text-slate-500">Qualification Score</p>
            <p className="text-3xl font-bold text-emerald-700 mt-2">92%</p>
          </div>
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <p className="text-sm text-slate-500">Win Probability</p>
            <p className="text-3xl font-bold text-blue-700 mt-2">81%</p>
          </div>
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <p className="text-sm text-slate-500">Estimated Value</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">$8.5M</p>
          </div>
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <p className="text-sm text-slate-500">Compliance Score</p>
            <p className="text-3xl font-bold text-emerald-700 mt-2">94%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Selected Opportunity</h2>
          <p className="text-lg mt-3 text-slate-800">Enterprise ERP Modernization and Cloud Migration Services</p>
          <p className="text-sm text-slate-500 mt-1">
            State Government Technology Office · Due August 15, 2026 · Source: State Procurement Portal
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Company Knowledge Sources</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li>✓ Corporate capabilities</li>
              <li>✓ Past performance library</li>
              <li>✓ Staffing profiles</li>
              <li>✓ Technical accelerators</li>
              <li>✓ Certifications</li>
              <li>✓ Case studies</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Generated Proposal Sections</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li>✓ Executive summary</li>
              <li>✓ Technical approach</li>
              <li>✓ Staffing plan</li>
              <li>✓ Project governance</li>
              <li>✓ Risk management</li>
              <li>✓ Transition plan</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Compliance Matrix</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Requirements matched</span>
                <span className="font-semibold text-emerald-700">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Partial matches</span>
                <span className="font-semibold text-yellow-600">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Unmapped</span>
                <span className="font-semibold text-red-600">1</span>
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-slate-500">Next action</p>
                <p className="font-semibold text-blue-700 mt-1">Send to BDM Review</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
