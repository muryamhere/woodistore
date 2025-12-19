
import { AdminDashboard } from "./_components/admin-dashboard";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminDashboard>
      {children}
    </AdminDashboard>
  );
}
