import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f5f7] text-[#1a2332]">
      <AppSidebar />

      <div className="flex-1 min-w-0">
        <AppHeader />

        <main className="min-h-[calc(100vh-64px)] bg-[#f4f5f7] px-6 py-5">
          {children}
        </main>
      </div>
    </div>
  );
}
