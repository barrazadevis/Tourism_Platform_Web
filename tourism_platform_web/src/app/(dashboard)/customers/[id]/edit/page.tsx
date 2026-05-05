import { CustomerForm } from "@/components/customers/customer-form"

interface EditCustomerPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const resolvedParams = await params;
  return (
    <CustomerForm 
      isEditing={true}
      customerId={resolvedParams.id}
    />
  )
}