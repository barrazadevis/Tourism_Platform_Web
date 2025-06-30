import { TravelPlanDetail } from "@/components/travel-plans/travel-plan-detail"

interface TravelPlanDetailPageProps {
  params: { tenant: string; id: string }
}

export default function TravelPlanDetailPage({ params }: TravelPlanDetailPageProps) {
  return <TravelPlanDetail tenant={params.tenant} planId={params.id} />
}