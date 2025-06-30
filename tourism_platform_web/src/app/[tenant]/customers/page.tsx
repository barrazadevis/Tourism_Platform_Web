import { CustomerList } from "@/components/customers/customer-list"

interface CustomersPageProps {
  params: { tenant: string }
}

export default function CustomersPage({ params }: CustomersPageProps) {
  return <CustomerList tenant={params.tenant} />
}