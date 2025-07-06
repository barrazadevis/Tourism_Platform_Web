'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/shared/loading"
import { Users, FileText, Calendar, DollarSign } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { analyticsService } from "@/services/analyticsService"
import { formatCurrency, formatNumber, getGrowthColor, getGrowthIcon } from "@/types/analytics"

interface DashboardProps {
  tenant: string
}

export function Dashboard({ tenant }: DashboardProps) {
  const { data: dashboardStats, loading, error, refetch } = useApi(
    () => analyticsService.getDashboardStats(),
    []
  )

  if (loading) return <Loading message="Cargando dashboard..." />

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button onClick={refetch} className="mt-2 text-blue-600 hover:underline">
          Reintentar
        </button>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Clientes",
      value: formatNumber(dashboardStats?.totalCustomers || 0),
      icon: Users,
      change: dashboardStats?.customersGrowth || 0,
      color: "text-blue-600"
    },
    {
      title: "Cotizaciones",
      value: formatNumber(dashboardStats?.totalQuotes || 0),
      icon: FileText,
      change: dashboardStats?.quotesGrowth || 0,
      color: "text-green-600"
    },
    {
      title: "Reservas",
      value: formatNumber(dashboardStats?.totalBookings || 0),
      icon: Calendar,
      change: dashboardStats?.bookingsGrowth || 0,
      color: "text-purple-600"
    },
    {
      title: "Ingresos",
      value: formatCurrency(dashboardStats?.totalRevenue || 0),
      icon: DollarSign,
      change: dashboardStats?.revenueGrowth || 0,
      color: "text-yellow-600"
    }
  ]

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  const getActivityTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
    } else if (diffHours > 0) {
      return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
    } else {
      return 'Hace unos minutos'
    }
  }

  const getActivityIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'draft':
        return 'bg-yellow-500'
      case 'confirmed':
      case 'approved':
      case 'completed':
        return 'bg-green-500'
      case 'cancelled':
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-blue-500'
    }
  }

  const formatUpcomingDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CO', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

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
              <p className={`text-xs font-medium flex items-center ${getGrowthColor(stat.change)}`}>
                <span className="mr-1">{getGrowthIcon(stat.change)}</span>
                {formatChange(stat.change)} desde el mes pasado
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
              {dashboardStats?.recentBookings && dashboardStats.recentBookings.length > 0 ? (
                dashboardStats.recentBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${getActivityIcon(booking.status)}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {booking.status === 'confirmed' ? 'Reserva confirmada' : 
                         booking.status === 'pending' ? 'Nueva reserva pendiente' :
                         booking.status === 'cancelled' ? 'Reserva cancelada' : 'Nueva actividad'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.customerName} - {booking.destination}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {getActivityTime(booking.createdAt)}
                      </p>
                      <p className="text-xs font-medium">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No hay actividad reciente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Destinos Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats?.topDestinations && dashboardStats.topDestinations.length > 0 ? (
                dashboardStats.topDestinations.slice(0, 5).map((destination, index) => (
                  <div key={destination.destination} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{destination.destination}</p>
                        <p className="text-xs text-gray-500">
                          {destination.bookingCount} reservas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(destination.revenue)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {destination.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No hay datos de destinos</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Métricas Clave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Valor Promedio</span>
              <span className="text-sm font-medium">
                {formatCurrency(dashboardStats?.averageBookingValue || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tasa de Conversión</span>
              <span className="text-sm font-medium">
                {(dashboardStats?.conversionRate || 0).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Proveedores Activos</span>
              <span className="text-sm font-medium">
                {formatNumber(dashboardStats?.activeSuppliers || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pagos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pagos Pendientes</span>
              <span className="text-sm font-medium text-yellow-600">
                {formatCurrency(dashboardStats?.pendingPayments || 0)}
              </span>
            </div>
            <div className="text-center">
              {dashboardStats?.pendingPayments && dashboardStats.pendingPayments > 0 && (
                <p className="text-xs text-yellow-600">
                  Requiere atención
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tareas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dashboardStats?.upcomingTasks && dashboardStats.upcomingTasks.length > 0 ? (
                dashboardStats.upcomingTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="text-sm">
                    <p className="font-medium truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      {formatUpcomingDate(task.dueDate)} - {task.priority}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  No hay tareas pendientes
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}