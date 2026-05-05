import { TravelPlanDetail } from "@/components/travel-plans/travel-plan-detail"

interface TravelPlanDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function TravelPlanDetailPage({ params }: TravelPlanDetailPageProps) {
  const resolvedParams = await params;
  return <TravelPlanDetail planId={resolvedParams.id} />
}