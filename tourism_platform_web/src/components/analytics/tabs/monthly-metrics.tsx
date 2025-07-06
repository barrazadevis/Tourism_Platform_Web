'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  FileText,
  CreditCard,
  RefreshCw,
  Download
} from "lucide-react"
import { Loading } from "@/components/shared/loading"
import { useApi } from "@/hooks/use-api"
import { analyticsService } from "@/services/analyticsService"
import { 
  formatCurrency, 
  formatNumber,
  formatPercentage,
  getGrowthColor,
  getGrowthIcon
} from "@/types/analytics"

interface MonthlyMetricsProps {
  tenant: string
}

export function MonthlyMetrics({ tenant }: MonthlyMetricsProps) {
  const [selectedMonths, setSelectedMonths] = useState("12")
  const [generating, setGenerating] = useState(false)

  const { data: monthlyMetrics, loading, error, refetch } = useApi(
    () => analyticsService.getMonthlyMetrics(parseInt(selectedMonths)),
    [selectedMonths]
  )

  const handleGenerateMetrics = async () => {
    setGenerating(true)
    try {
      await analyticsService.generateMonthlyMetrics()
      refetch()
    } catch (error) {
      console.error('Error generating metrics:', error)
      alert('Error al generar métricas')
    } finally {
      setGenerating(false)
    }
  }

  const handleExport = () => {
    alert('Funcionalidad de exportación próximamente')
  }

  const getMonthName = (month: number): string => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    return months[month - 1] || ''
  }

  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  if (loading) return <Loading message="Cargando métricas mensuales..." />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Métricas Mensuales</h1>
          <p className="text-gray-600">Análisis histórico mensual de rendimiento</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleGenerateMetrics} disabled={generating}>
            {generating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Generar Métricas
              </>
            )}
          </Button>
          <Button variant="outline" onClick={refetch}>
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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Período (meses)</label>
              <Select value={selectedMonths} onValueChange={setSelectedMonths}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Últimos 3 meses</SelectItem>
                  <SelectItem value="6">Últimos 6 meses</SelectItem>
                  <SelectItem value="12">Últimos 12 meses</SelectItem>
                  <SelectItem value="24">Últimos 24 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {monthlyMetrics && monthlyMetrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Promedio Mensual
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  monthlyMetrics.reduce((sum, m) => sum + m.totalRevenue, 0) / monthlyMetrics.length
                )}
              </div>
              <p className="text-xs text-gray-500">Ingresos por mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mejor Mes
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              {(() => {
                const bestMonth = monthlyMetrics.reduce((max, current) => 
                  current.totalRevenue > max.totalRevenue ? current : max
                )
                return (
                  <>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(bestMonth.totalRevenue)}
                    </div>
                    <p className="text-xs text-gray-500">
                      {getMonthName(bestMonth.month)} {bestMonth.year}
                    </p>
                  </>
                )
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Conversión Promedio
              </CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatPercentage(
                  monthlyMetrics.reduce((sum, m) => sum + m.conversionRate, 0) / monthlyMetrics.length
                )}
              </div>
              <p className="text-xs text-gray-500">Cotizaciones a reservas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Clientes Nuevos
              </CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatNumber(
                  monthlyMetrics.reduce((sum, m) => sum + m.newCustomers, 0)
                )}
              </div>
              <p className="text-xs text-gray-500">En el período</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Monthly Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <Button onClick={refetch} variant="outline" className="mt-2">
                Reintentar
              </Button>
            </div>
          ) : monthlyMetrics && monthlyMetrics.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                    <TableHead className="text-right">Reservas</TableHead>
                    <TableHead className="text-right">Clientes Nuevos</TableHead>
                    <TableHead className="text-right">Cotizaciones</TableHead>
                    <TableHead className="text-right">Conversión</TableHead>
                    <TableHead className="text-right">Valor Promedio</TableHead>
                    <TableHead className="text-right">Ganancia Neta</TableHead>
                    <TableHead className="text-right">Crecimiento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyMetrics.map((metric, index) => {
                    const previousMetric = monthlyMetrics[index + 1]
                    const revenueGrowth = previousMetric 
                      ? calculateGrowth(metric.totalRevenue, previousMetric.totalRevenue)
                      : 0

                    return (
                      <TableRow key={`${metric.year}-${metric.month}`}>
                        <TableCell className="font-medium">
                          {getMonthName(metric.month)} {metric.year}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(metric.totalRevenue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(metric.totalBookings)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(metric.newCustomers)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(metric.totalQuotes)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPercentage(metric.conversionRate)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(metric.averageBookingValue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(metric.netProfit)}
                        </TableCell>
                        <TableCell className="text-right">
                          {previousMetric && (
                            <div className={`flex items-center justify-end ${getGrowthColor(revenueGrowth)}`}>
                              <span className="mr-1">{getGrowthIcon(revenueGrowth)}</span>
                              <span>{revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500">No hay métricas mensuales disponibles</p>
              <p className="text-sm text-gray-400">
                Genera métricas para comenzar a ver los datos
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}