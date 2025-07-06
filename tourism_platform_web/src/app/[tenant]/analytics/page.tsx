import { Analytics } from "@/components/analytics/analytics"

interface AnalyticsPageProps {
  params: {
    tenant: string
  }
}

export default function AnalyticsPage({ params }: AnalyticsPageProps) {
  return <Analytics tenant={params.tenant} />
}