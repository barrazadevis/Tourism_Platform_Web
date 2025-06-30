'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CreditCard, Calendar, User, FileText } from "lucide-react"

interface PaymentSummaryData {
  bookingId: string
  bookingNumber: string
  customerName: string
  totalAmount: number
  totalPaid: number
  pendingAmount: number
  paymentStatus: string
  payments: Array<{
    id: string
    paymentNumber: string
    amount: number
    paymentMethod: string
    paymentDate: string
    status: string
  }>
}

const mockPaymentSummary: PaymentSummaryData = {
  bookingId: "1",
  bookingNumber: "BK-202401-0001",
  customerName: "María González",
  totalAmount: 2500000,
  totalPaid: 1500000,
  pendingAmount: 1000000,
  paymentStatus: "partial",
  payments: [
    {
      id: "1",
      paymentNumber: "PAY-202401-0001",
      amount: 1500000,
      paymentMethod: "Transferencia Bancaria",
      paymentDate: "2024-01-20",
      status: "paid"
    }
  ]
}

export function PaymentSummary() {
  const summary = mockPaymentSummary
  const paymentProgress = (summary.totalPaid / summary.totalAmount) * 100

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Resumen de Pagos</h2>
        <p className="text-gray-600">Reserva {summary.bookingNumber}</p>
      </div>

      {/* Payment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Total Reserva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(summary.totalAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-green-600" />
              Total Pagado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(summary.totalPaid)}
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${paymentProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {paymentProgress.toFixed(1)}% completado
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-red-600" />
              Saldo Pendiente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(summary.pendingAmount)}
            </p>
            <Badge className="mt-2 bg-yellow-100 text-yellow-800">
              Pago Parcial
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary.payments.map((payment, index) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{payment.paymentNumber}</p>
                    <p className="text-sm text-gray-500">
                      {payment.paymentMethod} • {formatDate(payment.paymentDate)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    {formatCurrency(payment.amount)}
                  </p>
                  <Badge className="bg-green-100 text-green-800">
                    Pagado
                  </Badge>
                </div>
              </div>
            ))}
            
            {summary.pendingAmount > 0 && (
              <div className="flex items-center justify-between p-4 border-2 border-dashed border-yellow-300 rounded-lg bg-yellow-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Pago Pendiente</p>
                    <p className="text-sm text-gray-500">
                      Saldo restante por pagar
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-600">
                    {formatCurrency(summary.pendingAmount)}
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Pendiente
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}