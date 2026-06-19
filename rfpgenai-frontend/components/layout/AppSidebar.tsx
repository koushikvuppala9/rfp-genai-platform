const navItems = [
  ["Executive Dashboard", "/"],
  ["Opportunity Intelligence", "/opportunities"],
  ["AI Qualification Review", "/opportunities/demo-detail"],
  ["Proposal Workspace", "/proposals/workspace"],
  ["Source Monitoring", "/source-monitoring"],
  ["Reports & Governance", "/reports-governance"],
];

export default function AppSidebar() {
  return (
    <aside className="relative w-72 shrink-0 bg-[#1a2332] text-white min-h-screen px-5 py-5">
      <div className="mb-8">
        <div className="text-xl font-semibold tracking-tight">RFP GenAI</div>
        <div className="mt-1 text-xs leading-5 text-slate-300">
          Procurement opportunity and proposal operations platform
        </div>
      </div>

      <nav className="space-y-1 text-sm">
        {navItems.map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="block rounded-md px-3 py-2.5 text-slate-100 hover:bg-white/10"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="absolute bottom-6 left-5 text-xs text-slate-300">
        Local environment
      </div>
    </aside>
  );
}
