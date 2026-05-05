import { TravelPlanDetail } from "@/components/travel-plans/travel-plan-detail"

interface TravelPlanDetailPageProps {
  params: { id: string }
}

export default function TravelPlanDetailPage({ params }: TravelPlanDetailPageProps) {
  return <TravelPlanDetail planId={params.id} />
}