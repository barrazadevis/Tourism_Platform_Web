import { BookingDetail } from "@/components/bookings/booking-detail"

interface BookingDetailPageProps {
  params: { id: string }
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  return <BookingDetail bookingId={params.id} />
}