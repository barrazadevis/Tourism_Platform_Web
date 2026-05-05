import { CustomerForm } from "@/components/customers/customer-form"

interface EditCustomerPageProps {
  params: { id: string }
}

export default function EditCustomerPage({ params }: EditCustomerPageProps) {
  return (
    <CustomerForm 
      isEditing={true}
      customerId={params.id}
    />
  )
}