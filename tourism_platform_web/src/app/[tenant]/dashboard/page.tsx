import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Calendar, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Total Clientes",
    value: "152",
    icon: Users,
    change: "+12%",
    color: "text-blue-600"
  },
  {
    title: "Cotizaciones",
    value: "48",
    icon: FileText,
    change: "+5%",
    color: "text-green-600"
  },
  {
    title: "Reservas",
    value: "24",
    icon: Calendar,
    change: "+8%",
    color: "text-purple-600"
  },
  {
    title: "Ingresos",
    value: "$125,000",
    icon: DollarSign,
    change: "+15%",
    color: "text-yellow-600"
  }
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen de tu negocio turístico</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 font-medium">
                {stat.change} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nueva cotización creada</p>
                  <p className="text-xs text-gray-500">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Reserva confirmada</p>
                  <p className="text-xs text-gray-500">Hace 4 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pago pendiente</p>
                  <p className="text-xs text-gray-500">Hace 1 día</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Salidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Cartagena - 4 días</p>
                  <p className="text-xs text-gray-500">María González</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">15 Ene</p>
                  <p className="text-xs text-gray-500">2 pasajeros</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">San Andrés - 7 días</p>
                  <p className="text-xs text-gray-500">Carlos Ruiz</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">20 Ene</p>
                  <p className="text-xs text-gray-500">4 pasajeros</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}