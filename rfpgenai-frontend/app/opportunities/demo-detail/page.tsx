import AppShell from "@/components/layout/AppShell";

export default function QualificationReviewPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          AI Qualification Review
        </h1>

        <p className="text-gray-600 mt-2">
          Automated opportunity assessment and capability alignment.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">

        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-500">
            Qualification Score
          </div>

          <div className="text-5xl font-bold text-green-600 mt-2">
            92%
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-500">
            Priority
          </div>

          <div className="text-3xl font-bold mt-2">
            HIGH
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-500">
            Recommendation
          </div>

          <div className="text-3xl font-bold text-blue-700 mt-2">
            PURSUE
          </div>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Opportunity Summary
        </h2>

        <div className="space-y-2">
          <p><strong>Opportunity:</strong> Enterprise ERP Modernization</p>
          <p><strong>Agency:</strong> State Government Technology Office</p>
          <p><strong>Estimated Value:</strong> $8.5M</p>
          <p><strong>Due Date:</strong> August 15, 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Capability Alignment
          </h2>

          <ul className="space-y-2">
            <li>✓ Enterprise Applications</li>
            <li>✓ Cloud Migration</li>
            <li>✓ Data Engineering</li>
            <li>✓ Managed Services</li>
            <li>✓ Program Management</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            AI Assessment
          </h2>

          <ul className="space-y-2">
            <li>Strong capability match</li>
            <li>Past performance alignment detected</li>
            <li>Multi-year engagement potential</li>
            <li>Low delivery risk profile</li>
            <li>Recommended for proposal generation</li>
          </ul>
        </div>

      </div>
    </AppShell>
  );
}
