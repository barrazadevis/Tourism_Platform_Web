'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  CreditCard, 
  Truck,
  MapPin,
  FileUp,
  BarChart3,
  Building2
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Compañías", href: "/companies", icon: Building2 },
  { name: "Clientes", href: "/customers", icon: Users },
  { name: "Cotizaciones", href: "/quotes", icon: FileText },
  { name: "Reservas", href: "/bookings", icon: Calendar },
  { name: "Pagos", href: "/payments", icon: CreditCard },
  { name: "Proveedores", href: "/suppliers", icon: Truck },
  { name: "Planes de Viaje", href: "/travel-plans", icon: MapPin },
  { name: "Documentos", href: "/documents", icon: FileUp },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Destinos", href: "/destinations", icon: MapPin }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col glass border-r border-border/50 z-20">
      <div className="flex h-16 items-center px-6 border-b border-border/50">
        <h1 className="text-2xl font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          TourismPro
        </h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const href = `${item.href}`
          const isActive = pathname === href
          
          return (
            <Link
              key={item.name}
              href={href}
              className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}