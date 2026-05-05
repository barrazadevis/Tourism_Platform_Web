import { NewBookingForm } from "@/components/bookings/new-booking-form"

interface NewBookingPageProps {
  searchParams: Promise<{ quoteId?: string }>
}

export default async function NewBookingPage({ searchParams }: NewBookingPageProps) {
  const resolvedParams = await searchParams;
  return <NewBookingForm quoteId={resolvedParams.quoteId} />
}