import { TravelPlanForm } from "@/components/travel-plans/travel-plan-form"

interface NewTravelPlanPageProps {
  params: { tenant: string }
}

export default function NewTravelPlanPage({ params }: NewTravelPlanPageProps) {
  return <TravelPlanForm tenant={params.tenant} />
}