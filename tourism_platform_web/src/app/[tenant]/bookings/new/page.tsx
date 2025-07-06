import { NewBookingForm } from "@/components/bookings/new-booking-form"

interface NewBookingPageProps {
  params: { tenant: string }
  searchParams: { quoteId?: string }
}

export default function NewBookingPage({ params, searchParams }: NewBookingPageProps) {
  return <NewBookingForm tenant={params.tenant} quoteId={searchParams.quoteId} />
}