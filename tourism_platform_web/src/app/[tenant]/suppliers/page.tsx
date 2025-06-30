import { SupplierList } from "@/components/suppliers/supplier-list"

interface SuppliersPageProps {
  params: { tenant: string }
}

export default function SuppliersPage({ params }: SuppliersPageProps) {
  return <SupplierList tenant={params.tenant} />
}