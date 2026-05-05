import { NewBookingForm } from "@/components/bookings/new-booking-form"

interface NewBookingPageProps {
  searchParams: { quoteId?: string }
}

export default function NewBookingPage({ searchParams }: NewBookingPageProps) {
  return <NewBookingForm quoteId={searchParams.quoteId} />
}