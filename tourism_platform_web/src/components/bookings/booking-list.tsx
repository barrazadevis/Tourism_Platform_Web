'use client'

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Eye, Users, Calendar, CreditCard, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Booking, BookingResponseDto } from "@/types/booking"
import { useApi } from "@/hooks/use-api"
import { bookingService } from "@/services/bookingService"
import { Loading } from "../shared/loading"

const getStatusColor = (status: Booking['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'confirmed': return 'bg-blue-100 text-blue-800'
    case 'in-progress': return 'bg-purple-100 text-purple-800'
    case 'completed': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentStatusColor = (status: Booking['paymentStatus']) => {
  switch (status) {
    case 'pending': return 'bg-red-100 text-red-800'
    case 'partial': return 'bg-yellow-100 text-yellow-800'
    case 'paid': return 'bg-green-100 text-green-800'
    case 'refunded': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: Booking['status']) => {
  switch (status) {
    case 'pending': return 'Pendiente'
    case 'confirmed': return 'Confirmada'
    case 'in-progress': return 'En Proceso'
    case 'completed': return 'Completada'
    case 'cancelled': return 'Cancelada'
    default: return status
  }
}

const getPaymentStatusText = (status: Booking['paymentStatus']) => {
  switch (status) {
    case 'pending': return 'Pendiente'
    case 'partial': return 'Parcial'
    case 'paid': return 'Pagado'
    case 'refunded': return 'Reembolsado'
    default: return status
  }
}

export function BookingList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: bookings, loading, error, refetch } = useApi<Booking[]>(
      () => bookingService.getBookings({
        page,
        pageSize 
      }),
      [searchTerm, page]
  )

  const safeBookings = bookings ?? [];
  const filteredBookings = safeBookings.filter(booking =>
    booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.destination.toLowerCase().includes(searchTerm.toLowerCase())
  )
      
  const totalRevenue = safeBookings.reduce((sum, b) => sum + b.totalPaid, 0)
  const pendingRevenue = safeBookings.reduce((sum, b) => sum + b.pendingAmount, 0)

  if (loading) return <Loading message="Cargando reservas..." />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-600">Gestiona las reservas confirmadas</p>
        </div>
        <Link href={`/quotes`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Crear desde Cotización
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Reservas</p>
                <p className="text-2xl font-bold">{safeBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Confirmadas</p>
                <p className="text-2xl font-bold">
                  {safeBookings.filter(b => b.status.toString().toLowerCase() === 'confirmed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Ingresos</p>
                <p className="text-lg font-bold">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">Pendiente Cobro</p>
                <p className="text-lg font-bold">
                  {formatCurrency(pendingRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Reservas</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar reservas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reserva</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Pasajeros</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead className="text-right">Valores</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.bookingNumber}</div>
                      <div className="text-sm text-gray-500">
                        Cotización: {booking.quoteNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {booking.destination}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(booking.departureDate)}</div>
                      <div className="text-gray-500">
                        al {formatDate(booking.returnDate)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {booking.passengersCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusText(booking.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                      {getPaymentStatusText(booking.paymentStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-sm">
                      <div className="font-medium">
                        {formatCurrency(booking.totalAmount)}
                      </div>
                      <div className="text-green-600">
                        Pagado: {formatCurrency(booking.totalPaid)}
                      </div>
                      {booking.pendingAmount > 0 && (
                        <div className="text-red-600">
                          Pendiente: {formatCurrency(booking.pendingAmount)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-1">
                      <Link href={`/bookings/${booking.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}