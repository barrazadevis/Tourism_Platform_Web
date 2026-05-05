import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

interface TenantLayoutProps {
  children: React.ReactNode
}

export default function TenantLayout({ children }: TenantLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-background text-foreground bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-secondary/5">
      <Sidebar/>
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 z-0">
          {children}
        </main>
      </div>
    </div>
  )
}