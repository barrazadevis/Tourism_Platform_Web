'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  FileText, 
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loading } from "@/components/shared/loading"
import { useApi } from "@/hooks/use-api"
import { analyticsService } from "@/services/analyticsService"
import { 
  formatCurrency, 
  formatNumber, 
  formatPercentage,
  getGrowthColor,
  getGrowthIcon,
  getDateRangePresets
} from "@/types/analytics"

interface AnalyticsOverviewProps {
  tenant: string
}

export function AnalyticsOverview({ tenant }: AnalyticsOverviewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  const { data: dashboardStats, loading: loadingStats, error: errorStats, refetch: refetchStats } = useApi(
    () => analyticsService.getDashboardStats(),
    []
  )

  const { data: monthlyMetrics, loading: loadingMetrics, error: errorMetrics } = useApi(
    () => analyticsService.getMonthlyMetrics(12),
    []
  )

  const { data: topCustomers, loading: loadingCustomers } = useApi(
    () => analyticsService.getTopCustomers(10),
    []
  )

  const { data: popularDestinations, loading: loadingDestinations } = useApi(
    () => analyticsService.getPopularDestinations(8),
    []
  )

  const datePresets = getDateRangePresets()

  const handleRefresh = () => {
    refetchStats()
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Funcionalidad de exportación próximamente')
  }

  if (loadingStats) return <Loading message="Cargando analytics..." />

  if (errorStats) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{errorStats}</p>
        <Button onClick={refetchStats} variant="outline" className="mt-2">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  const kpis = [
    {
      title: "Ingresos Totales",
      value: formatCurrency(dashboardStats?.totalRevenue || 0),
      change: dashboardStats?.revenueGrowth || 0,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Total Reservas",
      value: formatNumber(dashboardStats?.totalBookings || 0),
      change: dashboardStats?.bookingsGrowth || 0,
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Clientes Activos",
      value: formatNumber(dashboardStats?.totalCustomers || 0),
      change: dashboardStats?.customersGrowth || 0,
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Cotizaciones",
      value: formatNumber(dashboardStats?.totalQuotes || 0),
      change: dashboardStats?.quotesGrowth || 0,
      icon: FileText,
      color: "text-orange-600"
    },
    {
      title: "Valor Promedio",
      value: formatCurrency(dashboardStats?.averageBookingValue || 0),
      change: 0, // No tenemos este dato en el dashboard actual
      icon: TrendingUp,
      color: "text-teal-600"
    },
    {
      title: "Tasa de Conversión",
      value: formatPercentage(dashboardStats?.conversionRate || 0),
      change: 0, // No tenemos este dato en el dashboard actual
      icon: BarChart3,
      color: "text-pink-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Análisis detallado de tu negocio turístico</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            {datePresets.map(preset => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seleccionar métrica" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">Ingresos</SelectItem>
            <SelectItem value="bookings">Reservas</SelectItem>
            <SelectItem value="customers">Clientes</SelectItem>
            <SelectItem value="quotes">Cotizaciones</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{kpi.value}</div>
              {kpi.change !== 0 && (
                <div className={`flex items-center text-sm ${getGrowthColor(kpi.change)}`}>
                  <span className="mr-1">{getGrowthIcon(kpi.change)}</span>
                  <span>
                    {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}% vs mes anterior
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Tendencia de Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingMetrics ? (
              <div className="h-64 flex items-center justify-center">
                <Loading message="Cargando gráfico..." />
              </div>
            ) : monthlyMetrics && monthlyMetrics.length > 0 ? (
              <div className="h-64">
                {/* Aquí iría el componente de gráfico de líneas */}
                <div className="h-full bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Gráfico de tendencia de ingresos</p>
                    <p className="text-xs text-gray-500">
                      {monthlyMetrics.length} meses de datos
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">No hay datos suficientes</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Destinations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Destinos Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDestinations ? (
              <div className="h-64 flex items-center justify-center">
                <Loading message="Cargando destinos..." />
              </div>
            ) : popularDestinations && popularDestinations.length > 0 ? (
              <div className="space-y-3">
                {popularDestinations.slice(0, 6).map((destination, index) => (
                  <div key={destination.destination} className="flex items-center justify-between">
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
                      <div className="flex items-center text-xs">
                        <span className={getGrowthColor(destination.growthRate)}>
                          {destination.growthRate > 0 ? '+' : ''}{destination.growthRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">No hay datos de destinos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCustomers ? (
            <Loading message="Cargando clientes..." />
          ) : topCustomers && topCustomers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCustomers.slice(0, 6).map((customer, index) => (
                <div key={customer.customerId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">#{index + 1}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        customer.loyaltyTier === 'Platinum' ? 'bg-gray-200 text-gray-800' :
                        customer.loyaltyTier === 'Gold' ? 'bg-yellow-200 text-yellow-800' :
                        customer.loyaltyTier === 'Silver' ? 'bg-gray-100 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {customer.loyaltyTier}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{customer.customerName}</h4>
                  <p className="text-xs text-gray-500 mb-2">{customer.email}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Reservas:</span>
                      <span className="font-medium">{customer.totalBookings}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium">{formatCurrency(customer.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Promedio:</span>
                      <span className="font-medium">{formatCurrency(customer.averageBookingValue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500">No hay datos de clientes</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dashboardStats?.activeSuppliers || 0}
              </div>
              <div className="text-sm text-gray-600">Proveedores Activos</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(dashboardStats?.pendingPayments || 0)}
              </div>
              <div className="text-sm text-gray-600">Pagos Pendientes</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {dashboardStats?.recentBookings?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Actividades Recientes</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dashboardStats?.topDestinations?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Destinos Activos</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}