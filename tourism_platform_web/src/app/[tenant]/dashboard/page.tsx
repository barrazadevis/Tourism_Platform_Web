import { Dashboard } from "@/components/dashboard/dashboard-props"

interface DashboardPageProps {
  params: {
    tenant: string
  }
}

export default function DashboardPage({ params }: DashboardPageProps) {
  return <Dashboard tenant={params.tenant} />
}