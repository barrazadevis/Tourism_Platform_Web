import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

interface TenantLayoutProps {
  children: React.ReactNode
  params: { tenant: string }
}

export default function TenantLayout({ children, params }: TenantLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar tenant={params.tenant} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}