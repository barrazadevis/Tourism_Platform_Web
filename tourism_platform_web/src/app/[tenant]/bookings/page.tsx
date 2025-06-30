import { BookingList } from "@/components/bookings/booking-list"

interface BookingsPageProps {
  params: { tenant: string }
}

export default function BookingsPage({ params }: BookingsPageProps) {
  return <BookingList tenant={params.tenant} />
}