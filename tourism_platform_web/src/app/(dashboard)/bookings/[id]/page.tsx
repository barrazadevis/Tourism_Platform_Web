import { BookingDetail } from "@/components/bookings/booking-detail"

interface BookingDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const resolvedParams = await params;
  return <BookingDetail bookingId={resolvedParams.id} />
}