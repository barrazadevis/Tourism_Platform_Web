'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  MapPin, 
  CreditCard, 
  FileText,
  Edit,
  X,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { bookingService } from "@/services/bookingService"
import { ApiError } from "@/lib/api"
import { BookingResponseDto, BookingStatus, UpdateBookingStatusDto } from "@/types/booking"

interface Passenger {
  id: string
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  dateOfBirth: string
  gender: string
  nationality: string
  isMainPassenger: boolean
}

interface Payment {
  id: string
  paymentNumber: string
  amount: number
  paymentMethod: string
  paymentDate: string
  status: string
}

interface AddPassengerDto {
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  dateOfBirth: string
  gender: string
  nationality: string
  isMainPassenger: boolean
}

interface BookingDetailProps {
  tenant: string
  bookingId: string
}

export function BookingDetail({ tenant, bookingId }: BookingDetailProps) {
  const router = useRouter()
  const { user } = useAuth()
  
  const [booking, setBooking] = useState<BookingResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [showAddPassenger, setShowAddPassenger] = useState(false)
  const [isAddingPassenger, setIsAddingPassenger] = useState(false)
  
  const [newPassenger, setNewPassenger] = useState<AddPassengerDto>({
    firstName: "",
    lastName: "",
    documentType: "CC",
    documentNumber: "",
    dateOfBirth: "",
    gender: "M",
    nationality: "Colombiana",
    isMainPassenger: false
  })

  // Load booking data
  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        setError("ID de reserva no válido")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        const bookingData = await bookingService.getBookingById(bookingId)
        setBooking(bookingData)
      } catch (error) {
        console.error('Error loading booking:', error)
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : "Error al cargar la reserva"
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadBooking()
  }, [bookingId])

  const addPassenger = async () => {
    if (!booking) return

    // Validate form
    if (!newPassenger.firstName.trim() || !newPassenger.lastName.trim() || 
        !newPassenger.documentNumber.trim() || !newPassenger.dateOfBirth) {
      setError("Todos los campos obligatorios deben ser completados")
      return
    }

    setIsAddingPassenger(true)
    setError(null)

    try {
      // TODO: Implement add passenger API endpoint
      // const updatedBooking = await bookingService.addPassenger(booking.id, newPassenger)
      
      // For now, simulate the addition
      console.log('Adding passenger:', newPassenger)
      
      // Reset form
      setNewPassenger({
        firstName: "",
        lastName: "",
        documentType: "CC", 
        documentNumber: "",
        dateOfBirth: "",
        gender: "M",
        nationality: "Colombiana",
        isMainPassenger: false
      })
      setShowAddPassenger(false)
      
      // Reload booking data
      const updatedBooking = await bookingService.getBookingById(bookingId)
      setBooking(updatedBooking)
      
    } catch (error) {
      console.error('Error adding passenger:', error)
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : "Error al agregar pasajero"
      setError(errorMessage)
    } finally {
      setIsAddingPassenger(false)
    }
  }

  const updateBookingStatus = async (newStatus: string) => {
    if (!booking || booking.status.toString() === newStatus) return

    // Map newStatus (string) to BookingStatus enum
    const statusEnumMap: Record<string, BookingStatus> = {
      pending: BookingStatus.PENDING,
      confirmed: BookingStatus.CONFIRMED,
      inprogress: BookingStatus.IN_PROGRESS,
      completed: BookingStatus.COMPLETED,
      cancelled: BookingStatus.CANCELLED,
    }
    const mappedStatus = statusEnumMap[newStatus] || BookingStatus.PENDING;

    setIsUpdatingStatus(true)
    setError(null)

    try {
      const updateData: UpdateBookingStatusDto = {
        status: mappedStatus
      }
      
      const updatedBooking = await bookingService.updateBookingStatus(booking.id, updateData)
      setBooking(updatedBooking)
    } catch (error) {
      console.error('Error updating booking status:', error)
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : "Error al actualizar el estado"
      setError(errorMessage)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Confirmada", className: "bg-blue-100 text-blue-800" },
      'in-progress': { label: "En Proceso", className: "bg-purple-100 text-purple-800" },
      completed: { label: "Completada", className: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelada", className: "bg-red-100 text-red-800" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800" },
      partial: { label: "Pago Parcial", className: "bg-orange-100 text-orange-800" },
      paid: { label: "Pagado", className: "bg-green-100 text-green-800" },
      overdue: { label: "Vencido", className: "bg-red-100 text-red-800" }
    }
    
    const config = statusConfig[paymentStatus as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/${tenant}/bookings`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Cargando reserva...</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p>Cargando detalles de la reserva...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state or booking not found
  if (error || !booking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/${tenant}/bookings`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Error</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">{error || "No se encontró la reserva especificada."}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/${tenant}/bookings`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reserva {booking.bookingNumber}
            </h1>
            <p className="text-gray-600">
              Cotización: {booking.quoteId}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
            <select 
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={booking.status.toLowerCase()}
            onChange={(e) => updateBookingStatus(e.target.value as string)}
            disabled={isUpdatingStatus}
            >
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="inprogress">En Proceso</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Booking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Información del Viaje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Destino</label>
              <div className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                <span className="font-medium">{booking.destination || 'No especificado'}</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Salida</label>
              <p className="font-medium">{booking.departureDate ? formatDate(booking.departureDate) : 'No especificada'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Regreso</label>
              <p className="font-medium">{booking.returnDate ? formatDate(booking.returnDate) : 'No especificada'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Estado</label>
              <div className="mt-1">
                {getStatusBadge(booking.status.toString())}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Nombre</label>
              <p className="font-medium">{booking.customerName || 'No especificado'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{booking.customerEmail || 'No especificado'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Pasajeros</label>
              <p className="font-medium">{booking.passengers?.length || 0} personas</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Solicitudes Especiales</label>
              <p className="text-sm">{booking.specialRequests || "Ninguna"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Información de Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Total</label>
              <p className="font-bold text-lg">{formatCurrency(booking.totalAmount || 0)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Pagado</label>
              <p className="font-medium text-green-600">
                {formatCurrency(booking.totalPaid || 0)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Pendiente</label>
              <p className="font-medium text-red-600">
                {formatCurrency((booking.totalAmount || 0) - (booking.totalPaid || 0))}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Estado</label>
              <div className="mt-1">
                {getPaymentStatusBadge(booking.paymentStatus || 'pending')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Passengers */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Pasajeros</CardTitle>
            <Button 
              size="sm"
              onClick={() => setShowAddPassenger(true)}
              disabled={showAddPassenger}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Pasajero
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddPassenger && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Nuevo Pasajero</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAddPassenger(false)}
                  disabled={isAddingPassenger}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium">Nombres *</label>
                  <Input
                    value={newPassenger.firstName}
                    onChange={(e) => setNewPassenger(prev => ({
                      ...prev, firstName: e.target.value
                    }))}
                    disabled={isAddingPassenger}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Apellidos *</label>
                  <Input
                    value={newPassenger.lastName}
                    onChange={(e) => setNewPassenger(prev => ({
                      ...prev, lastName: e.target.value
                    }))}
                    disabled={isAddingPassenger}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Documento *</label>
                  <Input
                    value={newPassenger.documentNumber}
                    onChange={(e) => setNewPassenger(prev => ({
                      ...prev, documentNumber: e.target.value
                    }))}
                    disabled={isAddingPassenger}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo Documento</label>
                  <select
                    value={newPassenger.documentType}
                    onChange={(e) => setNewPassenger(prev => ({
                      ...prev, documentType: e.target.value
                    }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    disabled={isAddingPassenger}
                  >
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PP">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha Nacimiento *</label>
                  <Input
                    type="date"
                    value={newPassenger.dateOfBirth}
                    onChange={(e) => setNewPassenger(prev => ({
                      ...prev, dateOfBirth: e.target.value
                    }))}
                    disabled={isAddingPassenger}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Género</label>
                  <select
                    value={newPassenger.gender}
                    onChange={(e) => setNewPassenger(prev => ({
                      ...prev, gender: e.target.value
                    }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    disabled={isAddingPassenger}
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={addPassenger}
                  disabled={isAddingPassenger}
                >
                  {isAddingPassenger ? "Agregando..." : "Agregar"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddPassenger(false)}
                  disabled={isAddingPassenger}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Fecha Nacimiento</TableHead>
                <TableHead>Género</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {booking.passengers?.map((passenger) => (
                <TableRow key={passenger.id}>
                  <TableCell className="font-medium">
                    {passenger.firstName} {passenger.lastName}
                  </TableCell>
                  <TableCell>
                    {passenger.documentType} {passenger.documentNumber}
                  </TableCell>
                  <TableCell>{formatDate(passenger.dateOfBirth)}</TableCell>
                  <TableCell>{passenger.gender === 'M' ? 'Masculino' : 'Femenino'}</TableCell>
                  <TableCell>
                    {passenger.isMainPassenger ? (
                      <Badge className="bg-blue-100 text-blue-800">Principal</Badge>
                    ) : (
                      <Badge variant="outline">Acompañante</Badge>
                    )}
                  </TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell col-span={5} className="text-center text-gray-500">
                    No hay pasajeros registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payments */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Historial de Pagos</CardTitle>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Registrar Pago
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {booking.payments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.paymentNumber}
                  </TableCell>
                  <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      Pagado
                    </Badge>
                  </TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell col-span={5} className="text-center text-gray-500">
                    No hay pagos registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}