'use client'

import { useState } from "react"
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

interface Passenger {
  id: string
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  dateOfBirth: string
  gender: string
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

interface BookingDetail {
  id: string
  bookingNumber: string
  quoteNumber: string
  customerName: string
  customerEmail: string
  destination: string
  departureDate: string
  returnDate: string
  status: string
  totalAmount: number
  totalPaid: number
  pendingAmount: number
  paymentStatus: string
  specialRequests: string
  createdAt: string
  passengers: Passenger[]
  payments: Payment[]
}

// Datos de ejemplo
const mockBookingDetail: BookingDetail = {
  id: "1",
  bookingNumber: "BK-202401-0001",
  quoteNumber: "QT-202401-0001",
  customerName: "María González",
  customerEmail: "maria@email.com",
  destination: "Cartagena",
  departureDate: "2024-03-15",
  returnDate: "2024-03-19",
  status: "confirmed",
  totalAmount: 2500000,
  totalPaid: 1500000,
  pendingAmount: 1000000,
  paymentStatus: "partial",
  specialRequests: "Habitación con vista al mar, dieta vegetariana",
  createdAt: "2024-01-15",
  passengers: [
    {
      id: "1",
      firstName: "María",
      lastName: "González",
      documentType: "CC",
      documentNumber: "12345678",
      dateOfBirth: "1985-05-15",
      gender: "F",
      isMainPassenger: true
    },
    {
      id: "2",
      firstName: "Juan",
      lastName: "González",
      documentType: "CC",
      documentNumber: "87654321",
      dateOfBirth: "1982-03-20",
      gender: "M",
      isMainPassenger: false
    }
  ],
  payments: [
    {
      id: "1",
      paymentNumber: "PAY-202401-0001",
      amount: 1500000,
      paymentMethod: "Transferencia",
      paymentDate: "2024-01-20",
      status: "paid"
    }
  ]
}

interface BookingDetailProps {
  tenant: string
  bookingId: string
}

export function BookingDetail({ tenant, bookingId }: BookingDetailProps) {
  const router = useRouter()
  const [booking] = useState<BookingDetail>(mockBookingDetail)
  const [showAddPassenger, setShowAddPassenger] = useState(false)
  const [newPassenger, setNewPassenger] = useState({
    firstName: "",
    lastName: "",
    documentType: "CC",
    documentNumber: "",
    dateOfBirth: "",
    gender: "M"
  })

  const addPassenger = () => {
    // TODO: Implement add passenger
    console.log('Adding passenger:', newPassenger)
    setShowAddPassenger(false)
    setNewPassenger({
      firstName: "",
      lastName: "",
      documentType: "CC", 
      documentNumber: "",
      dateOfBirth: "",
      gender: "M"
    })
  }

  const updateBookingStatus = (newStatus: string) => {
    // TODO: Implement status update
    console.log('Updating booking status to:', newStatus)
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
              Cotización: {booking.quoteNumber}
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
            value={booking.status}
            onChange={(e) => updateBookingStatus(e.target.value)}
          >
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="in-progress">En Proceso</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
      </div>

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
                <span className="font-medium">{booking.destination}</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Salida</label>
              <p className="font-medium">{formatDate(booking.departureDate)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Regreso</label>
              <p className="font-medium">{formatDate(booking.returnDate)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Estado</label>
              <div className="mt-1">
                <Badge className="bg-blue-100 text-blue-800">
                  Confirmada
                </Badge>
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
              <p className="font-medium">{booking.customerName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{booking.customerEmail}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Pasajeros</label>
              <p className="font-medium">{booking.passengers.length} personas</p>
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
              <p className="font-bold text-lg">{formatCurrency(booking.totalAmount)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Pagado</label>
              <p className="font-medium text-green-600">
                {formatCurrency(booking.totalPaid)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Pendiente</label>
              <p className="font-medium text-red-600">
                {formatCurrency(booking.pendingAmount)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Estado</label>
              <div className="mt-1">
                <Badge className="bg-yellow-100 text-yellow-800">
                  Pago Parcial
                </Badge>
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
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium">Nombres</label>
                  <Input
                    value={newPassenger.firstName}
                    onChange={(e) => setNewPassenger(prev => ({
                      ...prev, firstName: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Apellidos</label>
                  <Input
                    value={newPassenger.lastName}
                    onChange={(e) => setNewPassenger(prev => ({
                      ...prev, lastName: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Documento</label>
                  <Input
                    value={newPassenger.documentNumber}
                    onChange={(e) => setNewPassenger(prev => ({
                      ...prev, documentNumber: e.target.value
                    }))}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={addPassenger}>
                  Agregar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddPassenger(false)}
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
              {booking.passengers.map((passenger) => (
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
              ))}
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
              {booking.payments.map((payment) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}