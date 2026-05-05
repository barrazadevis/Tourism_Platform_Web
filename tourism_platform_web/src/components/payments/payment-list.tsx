'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Plus, Filter, Download, CreditCard, TrendingUp, Clock, DollarSign, Eye, Edit } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loading } from "@/components/shared/loading"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useApi } from "@/hooks/use-api"
import { paymentService } from "@/services/paymentService"
import { bookingService } from "@/services/bookingService"
import { PaymentResponseDto, PaymentMethod, PaymentStatus, CreatePaymentDto } from "@/types/payment"
import { Booking, BookingResponseDto } from "@/types/booking"

const getStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.Pending: return 'bg-yellow-100 text-yellow-800'
    case PaymentStatus.Paid: return 'bg-green-100 text-green-800'
    case PaymentStatus.Partial: return 'bg-red-100 text-red-800'
    case PaymentStatus.Refunded: return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.Pending: return 'Pendiente'
    case PaymentStatus.Paid: return 'Pagado'
    case PaymentStatus.Partial: return 'Parcial'
    case PaymentStatus.Refunded: return 'Reembolsado'
    default: return status
  }
}

const getPaymentMethodText = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CreditCard: return 'Tarjeta de Crédito'
    case PaymentMethod.DebitCard: return 'Tarjeta de Débito'
    case PaymentMethod.BankTransfer: return 'Transferencia Bancaria'
    case PaymentMethod.Cash: return 'Efectivo'
    case PaymentMethod.Check: return 'Cheque'
    case PaymentMethod.PayPal: return 'PayPal'
    case PaymentMethod.Other: return 'Otro'
    default: return method
  }
}

interface PaymentFormData {
  bookingId: string
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  paymentDate: string
  description: string
  reference: string
  transactionId: string
  notes: string
}

interface PaymentListProps {
  tenant: string
}

export function PaymentList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [showNewPayment, setShowNewPayment] = useState(false)
  const [creating, setCreating] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const pageSize = 10

  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    bookingId: "",
    amount: 0,
    currency: "COP",
    paymentMethod: PaymentMethod.BankTransfer,
    paymentDate: new Date().toISOString().split('T')[0],
    description: "",
    reference: "",
    transactionId: "",
    notes: ""
  })

  const { data: payments, loading, error, refetch } = useApi<PaymentResponseDto[]>(
    () => paymentService.getPayments({ page, pageSize }),
    [page]
  )

  // Load bookings when dialog opens
  useEffect(() => {
    if (showNewPayment && bookings.length === 0) {
      loadBookings()
    }
  }, [showNewPayment])

  const loadBookings = async () => {
    setLoadingBookings(true)
    try {
      const bookingData = await bookingService.getBookings()
      setBookings(bookingData)
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoadingBookings(false)
    }
  }

  const handleBookingSelect = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId)
    if (booking) {
      setSelectedBooking(booking)
      setPaymentForm(prev => ({
        ...prev,
        bookingId: booking.id,
        // Pre-fill suggested amount (partial payment)
        amount: prev.amount || Math.round(booking.totalAmount * 0.5), // 50% suggestion
        description: `Pago para reserva ${booking.bookingNumber}`
      }))
    }
  }

  if (loading) return <Loading message="Cargando pagos..." />

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button onClick={refetch} variant="outline" className="mt-2">
          Reintentar
        </Button>
      </div>
    )
  }

  const filteredPayments = payments?.filter(payment =>
    payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.booking?.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.booking?.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  // Calculate stats from actual payments data
  const totalReceived = payments
    ?.filter(p => p.paymentStatus === PaymentStatus.Paid)
    .reduce((sum, p) => sum + p.amount, 0) || 0

  const pendingPayments = payments
    ?.filter(p => p.paymentStatus === PaymentStatus.Pending)
    .reduce((sum, p) => sum + p.amount, 0) || 0

  const thisMonthPayments = payments
    ?.filter(p => p.paymentStatus === PaymentStatus.Paid && 
      new Date(p.paymentDate).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0) || 0

  const handleCreatePayment = async () => {
    if (!paymentForm.bookingId || !paymentForm.amount) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    setCreating(true)
    try {
      const createData: CreatePaymentDto = {
        bookingId: paymentForm.bookingId,
        amount: paymentForm.amount,
        currency: paymentForm.currency,
        paymentMethod: paymentForm.paymentMethod,
        paymentDate: new Date(paymentForm.paymentDate).toISOString(),
        description: paymentForm.description,
        reference: paymentForm.reference,
        transactionId: paymentForm.transactionId,
        notes: paymentForm.notes
      }

      await paymentService.createPayment(createData)
      
      // Reset form
      setPaymentForm({
        bookingId: "",
        amount: 0,
        currency: "COP",
        paymentMethod: PaymentMethod.BankTransfer,
        paymentDate: new Date().toISOString().split('T')[0],
        description: "",
        reference: "",
        transactionId: "",
        notes: ""
      })
      
      setSelectedBooking(null)
      setShowNewPayment(false)
      refetch() // Refresh the payments list
    } catch (error) {
      console.error('Error creating payment:', error)
      alert('Error al crear el pago. Por favor intenta de nuevo.')
    } finally {
      setCreating(false)
    }
  }

  const resetForm = () => {
    setPaymentForm({
      bookingId: "",
      amount: 0,
      currency: "COP",
      paymentMethod: PaymentMethod.BankTransfer,
      paymentDate: new Date().toISOString().split('T')[0],
      description: "",
      reference: "",
      transactionId: "",
      notes: ""
    })
    setSelectedBooking(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pagos</h1>
          <p className="text-gray-600">Gestiona los pagos y transacciones</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => setShowNewPayment(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Pago
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Recibido</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalReceived)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pagos Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(pendingPayments)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Este Mes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(thisMonthPayments)}
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
                <p className="text-sm text-gray-600">Total Transacciones</p>
                <p className="text-2xl font-bold">{payments?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pagos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Reserva</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.paymentNumber}
                  </TableCell>
                  <TableCell>{payment.booking?.bookingNumber || '-'}</TableCell>
                  <TableCell>{payment.booking?.customerName || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                      {payment.paymentMethod}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.paymentStatus)}>
                      {getStatusText(payment.paymentStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {payment.transactionId || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-1">
                      <Link href={`/payments/${payment.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron pagos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Payment Dialog */}
      <Dialog open={showNewPayment} onOpenChange={(open) => {
        setShowNewPayment(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Pago</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Booking Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Reserva *</label>
              {loadingBookings ? (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  <span>Cargando reservas...</span>
                </div>
              ) : (
                <Select
                  value={paymentForm.bookingId}
                  onValueChange={handleBookingSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar una reserva" />
                  </SelectTrigger>
                  <SelectContent>
                    {bookings.map((booking) => (
                      <SelectItem key={booking.id} value={booking.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{booking.bookingNumber}</span>
                          <span className="text-sm text-gray-500">
                            {booking.customerName} - {formatCurrency(booking.totalAmount)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {/* Selected Booking Info */}
              {selectedBooking && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm">
                    <div className="font-medium text-blue-900">{selectedBooking.bookingNumber}</div>
                    <div className="text-blue-700">Cliente: {selectedBooking.customerName}</div>
                    <div className="text-blue-700">Total: {formatCurrency(selectedBooking.totalAmount)}</div>
                    <div className="text-blue-700">
                      Fechas: {formatDate(selectedBooking.departureDate)} - {formatDate(selectedBooking.returnDate)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Fecha de Pago *</label>
                <Input
                  type="date"
                  value={paymentForm.paymentDate}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Monto *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm(prev => ({ 
                    ...prev, amount: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="0.00"
                />
                {selectedBooking && (
                  <div className="mt-1 text-xs text-gray-500">
                    Total reserva: {formatCurrency(selectedBooking.totalAmount)}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Moneda</label>
                <Select
                  value={paymentForm.currency}
                  onValueChange={(value: any) => setPaymentForm(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COP">COP</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Método de Pago *</label>
                <Select
                  value={paymentForm.paymentMethod}
                  onValueChange={(value: PaymentMethod) => setPaymentForm(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PaymentMethod.BankTransfer}>Transferencia Bancaria</SelectItem>
                    <SelectItem value={PaymentMethod.CreditCard}>Tarjeta de Crédito</SelectItem>
                    <SelectItem value={PaymentMethod.DebitCard}>Tarjeta de Débito</SelectItem>
                    <SelectItem value={PaymentMethod.Cash}>Efectivo</SelectItem>
                    <SelectItem value={PaymentMethod.Check}>Cheque</SelectItem>
                    <SelectItem value={PaymentMethod.PayPal}>PayPal</SelectItem>
                    <SelectItem value={PaymentMethod.Other}>Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Referencia</label>
                <Input
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, reference: e.target.value }))}
                  placeholder="Referencia del pago"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">ID de Transacción</label>
                <Input
                  value={paymentForm.transactionId}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, transactionId: e.target.value }))}
                  placeholder="TXN123456789"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Descripción</label>
              <Input
                value={paymentForm.description}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del pago"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Notas</label>
              <textarea
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
                placeholder="Notas adicionales sobre el pago..."
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button 
                onClick={handleCreatePayment} 
                className="flex-1"
                disabled={creating || !paymentForm.bookingId}
              >
                {creating ? 'Creando...' : 'Registrar Pago'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewPayment(false)}
                className="flex-1"
                disabled={creating}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}