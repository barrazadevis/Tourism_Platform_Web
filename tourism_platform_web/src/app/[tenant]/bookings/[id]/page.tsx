import { BookingDetail } from "@/components/bookings/booking-detail"

interface BookingDetailPageProps {
  params: { tenant: string; id: string }
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  return <BookingDetail tenant={params.tenant} bookingId={params.id} />
}