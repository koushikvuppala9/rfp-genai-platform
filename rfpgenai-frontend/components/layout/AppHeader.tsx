export default function AppHeader() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          EITACIES INC - RFP GenAI Platform
        </h1>
        <p className="text-xs text-slate-500">
          Procurement opportunity monitoring, qualification, and proposal
          operations
        </p>
      </div>

      <div className="flex items-center gap-3 text-sm text-slate-700">
        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
          KV
        </div>
        <div className="text-right">
          <div className="font-medium">Koushik Vuppala</div>
          <div className="text-xs text-slate-500">Product Engineering</div>
        </div>
      </div>
    </header>
  );
}
