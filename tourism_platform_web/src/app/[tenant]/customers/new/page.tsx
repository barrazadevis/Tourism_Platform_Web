import { CustomerForm } from "@/components/customers/customer-form"

interface NewCustomerPageProps {
  params: { tenant: string }
}

export default function NewCustomerPage({ params }: NewCustomerPageProps) {
  return <CustomerForm tenant={params.tenant} />
}