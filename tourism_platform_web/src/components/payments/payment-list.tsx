'use client'

import { useState } from "react"
import { Search, Plus, Filter, Download, CreditCard, TrendingUp, Clock, DollarSign } from "lucide-react"
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
import { formatCurrency, formatDate } from "@/lib/utils"

interface Payment {
  id: string
  paymentNumber: string
  bookingNumber: string
  customerName: string
  amount: number
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentDate: string
  transactionId: string
  currency: string
  notes: string
  createdAt: string
}

// Datos de ejemplo
const mockPayments: Payment[] = [
  {
    id: "1",
    paymentNumber: "PAY-202401-0001",
    bookingNumber: "BK-202401-0001",
    customerName: "María González",
    amount: 1500000,
    paymentMethod: "Transferencia Bancaria",
    paymentStatus: "paid",
    paymentDate: "2024-01-20",
    transactionId: "TXN123456789",
    currency: "COP",
    notes: "Primer pago - 60%",
    createdAt: "2024-01-20"
  },
  {
    id: "2",
    paymentNumber: "PAY-202401-0002",
    bookingNumber: "BK-202401-0002",
    customerName: "Carlos Ruiz",
    amount: 1600000,
    paymentMethod: "Tarjeta de Crédito",
    paymentStatus: "paid",
    paymentDate: "2024-01-22",
    transactionId: "TXN987654321",
    currency: "COP",
    notes: "Pago inicial - 50%",
    createdAt: "2024-01-22"
  },
  {
    id: "3",
    paymentNumber: "PAY-202401-0003",
    bookingNumber: "BK-202401-0003",
    customerName: "Ana Martínez",
    amount: 1800000,
    paymentMethod: "Efectivo",
    paymentStatus: "paid",
    paymentDate: "2024-02-01",
    transactionId: "TXN555666777",
    currency: "COP",
    notes: "Pago completo",
    createdAt: "2024-02-01"
  },
  {
    id: "4",
    paymentNumber: "PAY-202401-0004",
    bookingNumber: "BK-202401-0001",
    customerName: "María González",
    amount: 1000000,
    paymentMethod: "Transferencia Bancaria",
    paymentStatus: "pending",
    paymentDate: "2024-03-01",
    transactionId: "",
    currency: "COP",
    notes: "Pago final pendiente",
    createdAt: "2024-02-15"
  }
]

const getStatusColor = (status: Payment['paymentStatus']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'paid': return 'bg-green-100 text-green-800'
    case 'failed': return 'bg-red-100 text-red-800'
    case 'refunded': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: Payment['paymentStatus']) => {
  switch (status) {
    case 'pending': return 'Pendiente'
    case 'paid': return 'Pagado'
    case 'failed': return 'Fallido'
    case 'refunded': return 'Reembolsado'
    default: return status
  }
}

interface PaymentFormData {
  bookingId: string
  amount: number
  paymentMethod: string
  transactionId: string
  notes: string
}

interface PaymentListProps {
  tenant: string
}

export function PaymentList({ tenant }: PaymentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [payments] = useState<Payment[]>(mockPayments)
  const [showNewPayment, setShowNewPayment] = useState(false)
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    bookingId: "",
    amount: 0,
    paymentMethod: "Transferencia Bancaria",
    transactionId: "",
    notes: ""
  })

  const filteredPayments = payments.filter(payment =>
    payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalReceived = payments
    .filter(p => p.paymentStatus === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingPayments = payments
    .filter(p => p.paymentStatus === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  const thisMonthPayments = payments
    .filter(p => p.paymentStatus === 'paid' && 
      new Date(p.paymentDate).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0)

  const handleCreatePayment = () => {
    console.log('Creating payment:', paymentForm)
    setShowNewPayment(false)
    setPaymentForm({
      bookingId: "",
      amount: 0,
      paymentMethod: "Transferencia Bancaria",
      transactionId: "",
      notes: ""
    })
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
                <p className="text-2xl font-bold">{payments.length}</p>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.paymentNumber}
                  </TableCell>
                  <TableCell>{payment.bookingNumber}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Payment Dialog */}
      <Dialog open={showNewPayment} onOpenChange={setShowNewPayment}>
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Pago</DialogTitle>
          <DialogClose onClose={() => setShowNewPayment(false)} />
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reserva</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={paymentForm.bookingId}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, bookingId: e.target.value }))}
              >
                <option value="">Seleccionar reserva</option>
                <option value="BK-202401-0001">BK-202401-0001 - María González</option>
                <option value="BK-202401-0002">BK-202401-0002 - Carlos Ruiz</option>
                <option value="BK-202401-0003">BK-202401-0003 - Ana Martínez</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Monto</label>
                <Input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm(prev => ({ 
                    ...prev, amount: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Método de Pago</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                >
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                  <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="PSE">PSE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">ID de Transacción</label>
              <Input
                value={paymentForm.transactionId}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, transactionId: e.target.value }))}
                placeholder="TXN123456789"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Notas</label>
              <textarea
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
                placeholder="Notas adicionales sobre el pago..."
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button onClick={handleCreatePayment} className="flex-1">
                Registrar Pago
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewPayment(false)}
                className="flex-1"
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