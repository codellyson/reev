import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { ErrorBoundary } from "@/app/components/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <ErrorBoundary>{children}</ErrorBoundary>
    </DashboardLayout>
  );
}

