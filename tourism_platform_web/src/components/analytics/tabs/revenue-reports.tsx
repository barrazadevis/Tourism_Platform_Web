'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  RefreshCw
} from "lucide-react"
import { Loading } from "@/components/shared/loading"
import { useApi } from "@/hooks/use-api"
import { analyticsService } from "@/services/analyticsService"
import { 
  formatCurrency, 
  formatNumber,
  getGrowthColor,
  getGrowthIcon,
  getPeriodLabel
} from "@/types/analytics"

interface RevenueReportsProps {
  tenant: string
}

export function RevenueReports() {
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    return date.toISOString().split('T')[0]
  })
  
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })

  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth")

  const { data: revenueReport, loading, error, refetch } = useApi(
    () => analyticsService.getRevenueReport(fromDate, toDate),
    [fromDate, toDate]
  )

  const handleQuickSelect = (period: string) => {
    const today = new Date()
    let start: Date
    let end: Date = today

    switch (period) {
      case "today":
        start = today
        break
      case "yesterday":
        start = new Date(today)
        start.setDate(start.getDate() - 1)
        end = start
        break
      case "thisWeek":
        start = new Date(today)
        start.setDate(today.getDate() - today.getDay())
        break
      case "lastWeek":
        start = new Date(today)
        start.setDate(today.getDate() - today.getDay() - 7)
        end = new Date(start)
        end.setDate(end.getDate() + 6)
        break
      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        break
      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        end = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      case "thisYear":
        start = new Date(today.getFullYear(), 0, 1)
        break
      default:
        return
    }

    setFromDate(start.toISOString().split('T')[0])
    setToDate(end.toISOString().split('T')[0])
    setSelectedPeriod(period)
  }

  const handleExport = () => {
    alert('Funcionalidad de exportación próximamente')
  }

  // Calculate totals
  const totals = revenueReport?.reduce(
    (acc, item) => ({
      totalRevenue: acc.totalRevenue + item.totalRevenue,
      bookingRevenue: acc.bookingRevenue + item.bookingRevenue,
      serviceRevenue: acc.serviceRevenue + item.serviceRevenue,
      bookingCount: acc.bookingCount + item.bookingCount
    }),
    { totalRevenue: 0, bookingRevenue: 0, serviceRevenue: 0, bookingCount: 0 }
  ) || { totalRevenue: 0, bookingRevenue: 0, serviceRevenue: 0, bookingCount: 0 }

  const averageBookingValue = totals.bookingCount > 0 ? totals.totalRevenue / totals.bookingCount : 0

  if (loading) return <Loading message="Cargando reporte de ingresos..." />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes de Ingresos</h1>
          <p className="text-gray-600">Análisis detallado de ingresos por período</p>
        </div>
        <div className="flex space-x-2">
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
        <CardHeader>
          <CardTitle>Filtros de Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Desde</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Hasta</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Período Rápido</label>
              <Select value={selectedPeriod} onValueChange={handleQuickSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="yesterday">Ayer</SelectItem>
                  <SelectItem value="thisWeek">Esta Semana</SelectItem>
                  <SelectItem value="lastWeek">Semana Pasada</SelectItem>
                  <SelectItem value="thisMonth">Este Mes</SelectItem>
                  <SelectItem value="lastMonth">Mes Pasado</SelectItem>
                  <SelectItem value="thisYear">Este Año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={refetch} className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" />
                Generar Reporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totals.totalRevenue)}
            </div>
            <p className="text-xs text-gray-500">
              Período seleccionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos por Reservas
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totals.bookingRevenue)}
            </div>
            <p className="text-xs text-gray-500">
              {((totals.bookingRevenue / totals.totalRevenue) * 100 || 0).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reservas
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(totals.bookingCount)}
            </div>
            <p className="text-xs text-gray-500">
              Reservas confirmadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Valor Promedio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(averageBookingValue)}
            </div>
            <p className="text-xs text-gray-500">
              Por reserva
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Gráfico de ingresos por período</p>
              <p className="text-xs text-gray-500">
                {revenueReport?.length || 0} puntos de datos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reporte Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <Button onClick={refetch} variant="outline" className="mt-2">
                Reintentar
              </Button>
            </div>
          ) : revenueReport && revenueReport.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead className="text-right">Ingresos Totales</TableHead>
                  <TableHead className="text-right">Ingresos Reservas</TableHead>
                  <TableHead className="text-right">Ingresos Servicios</TableHead>
                  <TableHead className="text-right">Reservas</TableHead>
                  <TableHead className="text-right">Valor Promedio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueReport.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {new Date(item.date).toLocaleDateString('es-CO')}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{getPeriodLabel(item.period)}</span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.totalRevenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.bookingRevenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.serviceRevenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(item.bookingCount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.averageBookingValue)}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals Row */}
                <TableRow className="bg-gray-50 font-medium">
                  <TableCell className="font-bold">TOTAL</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell className="text-right font-bold text-green-600">
                    {formatCurrency(totals.totalRevenue)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(totals.bookingRevenue)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(totals.serviceRevenue)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatNumber(totals.bookingCount)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(averageBookingValue)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500">No hay datos para el período seleccionado</p>
              <p className="text-sm text-gray-400">
                Selecciona un rango de fechas diferente
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}