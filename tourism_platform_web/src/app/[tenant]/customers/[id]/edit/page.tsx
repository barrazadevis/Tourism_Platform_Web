import { CustomerForm } from "@/components/customers/customer-form"

interface EditCustomerPageProps {
  params: { tenant: string; id: string }
}

export default function EditCustomerPage({ params }: EditCustomerPageProps) {
  return (
    <CustomerForm 
      tenant={params.tenant} 
      isEditing={true}
      customerId={params.id}
    />
  )
}