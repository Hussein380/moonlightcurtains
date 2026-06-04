import { Sidebar } from "@/components/admin/Sidebar";
import { AuthGuard } from "@/components/admin/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col md:flex-row min-h-screen bg-zinc-50">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
