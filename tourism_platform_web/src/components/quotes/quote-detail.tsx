// src/components/quotes/quote-detail.tsx
'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  CheckCircle, 
  XCircle, 
  Calendar,
  User,
  MapPin,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { QuoteResponse, quoteService } from "@/services/quotes"

interface QuoteDetailData {
  id: string
  quoteNumber: string
  customerName: string
  customerEmail: string
  destination: string
  departureDate: string
  returnDate: string
  numberOfAdults: number
  numberOfChildren: number
  numberOfInfants: number
  totalAmount: number
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired' | 'converted'
  validUntil: string
  currency: string
  notes: string
  createdAt: string
  items: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  hotels: Array<{
    id: string
    hotelName: string
    roomType: string
    planType: string
    nights: number
    roomPrice: number
    taxesPrice: number
    checkInDate: string
    checkOutDate: string
  }>
}

// Mock data
const mockQuoteData: QuoteDetailData = {
  id: "1",
  quoteNumber: "QT-202401-0001",
  customerName: "María González",
  customerEmail: "maria@email.com",
  destination: "Cartagena",
  departureDate: "2024-03-15",
  returnDate: "2024-03-19",
  numberOfAdults: 2,
  numberOfChildren: 1,
  numberOfInfants: 0,
  totalAmount: 2500000,
  status: "pending",
  validUntil: "2024-02-15",
  currency: "COP",
  notes: "Cliente prefiere hotel en zona histórica. Requiere habitación con vista al mar.",
  createdAt: "2024-01-15",
  items: [
    {
      id: "1",
      description: "Tiquetes aéreos Bogotá - Cartagena",
      quantity: 3,
      unitPrice: 350000,
      totalPrice: 1050000
    },
    {
      id: "2", 
      description: "Traslados aeropuerto - hotel",
      quantity: 2,
      unitPrice: 80000,
      totalPrice: 160000
    },
    {
      id: "3",
      description: "Seguro de viaje",
      quantity: 3,
      unitPrice: 45000,
      totalPrice: 135000
    }
  ],
  hotels: [
    {
      id: "1",
      hotelName: "Hotel Caribe By Faranda",
      roomType: "Habitación Doble Superior",
      planType: "Todo Incluido",
      nights: 4,
      roomPrice: 980000,
      taxesPrice: 175000,
      checkInDate: "2024-03-15",
      checkOutDate: "2024-03-19"
    }
  ]
}

const getStatusColor = (status: QuoteDetailData['status']) => {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'approved': return 'bg-green-100 text-green-800'
    case 'rejected': return 'bg-red-100 text-red-800'
    case 'expired': return 'bg-orange-100 text-orange-800'
    case 'converted': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: QuoteDetailData['status']) => {
  switch (status) {
    case 'draft': return 'Borrador'
    case 'pending': return 'Pendiente'
    case 'approved': return 'Aprobada'
    case 'rejected': return 'Rechazada'
    case 'expired': return 'Expirada'
    case 'converted': return 'Convertida'
    default: return status
  }
}

interface QuoteDetailProps {
  tenant: string
  quoteId: string
}

export function QuoteDetail({ tenant, quoteId }: QuoteDetailProps) {
  const router = useRouter()
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadQuote = async () => {
      setIsLoading(true)
      try {
        const data = await quoteService.getQuoteById(quoteId)
        setQuote(data)
      } catch (error) {
        console.error('Error loading quote:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadQuote()
  }, [quoteId])
  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected') => {
    setIsLoading(true)
    try {
      await quoteService.updateQuoteStatus(quoteId, newStatus)
      // Actualizar estado local o recargar datos
      window.location.reload() // O actualizar state
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConvertToBooking = () => {
    router.push(`/${tenant}/bookings/new?quoteId=${quoteId}`)
  }

  const totalPassengers = quote
    ? quote.numberOfAdults + quote.numberOfChildren + quote.numberOfInfants
    : 0

  if (!quote) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500">Cargando cotización...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/${tenant}/quotes`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {quote.quoteNumber}
            </h1>
            <p className="text-gray-600">
              Cotización para {quote.customerName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(quote.status as QuoteDetailData['status'])}>
            {getStatusText(quote.status as QuoteDetailData['status'])}
          </Badge>
          
          {quote.status.toLocaleLowerCase() != 'approved' && (
            <>
              <Button 
                onClick={() => handleStatusUpdate('approved')}
                disabled={isLoading}
                size="sm"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprobar
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isLoading}
                size="sm"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Rechazar
              </Button>
            </>
          )}
          
          {quote.status.toLocaleLowerCase() === 'approved' && (
            <Button onClick={handleConvertToBooking}>
              <Calendar className="mr-2 h-4 w-4" />
              Crear Reserva
            </Button>
          )}
          
          <Link href={`/${tenant}/quotes/${quoteId}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </div>
      </div>

      {/* Quote Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-medium">{quote.customerName}</p>
                <p className="text-xs text-gray-500">{quote.customerEmail}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Destino</p>
                <p className="font-medium">{quote.travelPlanName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Fechas</p>
                <p className="font-medium text-sm">
                  {formatDate(quote.departureDate)}
                </p>
                <p className="text-xs text-gray-500">
                  al {formatDate(quote.returnDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Pasajeros</p>
                <p className="font-medium">{totalPassengers} personas</p>
                <p className="text-xs text-gray-500">
                  {quote.numberOfAdults}A {quote.numberOfChildren}N {quote.numberOfInfants}I
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items de la Cotización</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead className="text-right">Precio Unit.</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quote.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.totalPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Hotels */}
      {quote.hotels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hoteles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quote.hotels.map((hotel) => (
              <div key={hotel.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-lg">{hotel.hotelName}</h4>
                    <p className="text-sm text-gray-600">{hotel.roomType}</p>
                    <p className="text-sm text-gray-600">{hotel.planType}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Check-in:</span>
                      <span>{formatDate(hotel.checkInDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out:</span>
                      <span>{formatDate(hotel.checkOutDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Noches:</span>
                      <span>{hotel.nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Habitación:</span>
                      <span>{formatCurrency(hotel.roomPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impuestos:</span>
                      <span>{formatCurrency(hotel.taxesPrice)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Hotel:</span>
                      <span>{formatCurrency(hotel.roomPrice + hotel.taxesPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {quote.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{quote.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Total */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                Válida hasta: {formatDate(quote.validUntil)}
              </p>
              <p className="text-sm text-gray-600">
                Creada: {formatDate(quote.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Cotización</p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(quote.totalAmount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}