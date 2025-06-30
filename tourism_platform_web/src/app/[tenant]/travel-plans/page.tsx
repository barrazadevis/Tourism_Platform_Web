import { TravelPlanList } from "@/components/travel-plans/travel-plan-list"

interface TravelPlansPageProps {
  params: { tenant: string }
}

export default function TravelPlansPage({ params }: TravelPlansPageProps) {
  return <TravelPlanList tenant={params.tenant} />
}