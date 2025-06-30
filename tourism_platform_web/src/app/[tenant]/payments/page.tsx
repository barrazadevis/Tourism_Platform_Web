import { PaymentList } from "@/components/payments/payment-list"

interface PaymentsPageProps {
  params: { tenant: string }
}

export default function PaymentsPage({ params }: PaymentsPageProps) {
  return <PaymentList tenant={params.tenant} />
}