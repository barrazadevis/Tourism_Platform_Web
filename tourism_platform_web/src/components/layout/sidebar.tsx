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
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Compañía", href: "/company", icon: LayoutDashboard },
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
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-bold text-primary">TourismPro</h1>
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
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-gray-500"
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