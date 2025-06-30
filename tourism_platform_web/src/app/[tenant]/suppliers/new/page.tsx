import { SupplierForm } from "@/components/suppliers/supplier-form"

interface NewSupplierPageProps {
  params: { tenant: string }
}

export default function NewSupplierPage({ params }: NewSupplierPageProps) {
  return <SupplierForm tenant={params.tenant} />
}