'use client'

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Eye, Edit, FileText, Calendar } from "lucide-react"
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

interface Quote {
  id: string
  quoteNumber: string
  customerName: string
  destination: string
  departureDate: string
  returnDate: string
  totalAmount: number
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired' | 'converted'
  validUntil: string
  createdAt: string
}

// Datos de ejemplo
const mockQuotes: Quote[] = [
  {
    id: "1",
    quoteNumber: "QT-202401-0001",
    customerName: "María González",
    destination: "Cartagena",
    departureDate: "2024-03-15",
    returnDate: "2024-03-19",
    totalAmount: 2500000,
    status: "approved",
    validUntil: "2024-02-15",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    quoteNumber: "QT-202401-0002", 
    customerName: "Carlos Ruiz",
    destination: "San Andrés",
    departureDate: "2024-04-10",
    returnDate: "2024-04-17",
    totalAmount: 3200000,
    status: "pending",
    validUntil: "2024-02-20",
    createdAt: "2024-01-20"
  },
  {
    id: "3",
    quoteNumber: "QT-202401-0003",
    customerName: "Ana Martínez", 
    destination: "Medellín",
    departureDate: "2024-05-01",
    returnDate: "2024-05-05",
    totalAmount: 1800000,
    status: "draft",
    validUntil: "2024-03-01",
    createdAt: "2024-02-01"
  }
]

const getStatusColor = (status: Quote['status']) => {
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

const getStatusText = (status: Quote['status']) => {
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

interface QuoteListProps {
  tenant: string
}

export function QuoteList({ tenant }: QuoteListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [quotes] = useState<Quote[]>(mockQuotes)

  const filteredQuotes = quotes.filter(quote =>
    quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.destination.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cotizaciones</h1>
          <p className="text-gray-600">Gestiona las cotizaciones de viaje</p>
        </div>
        <Link href={`/${tenant}/quotes/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cotización
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{quotes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold">
                  {quotes.filter(q => q.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">Aprobadas</p>
                <p className="text-2xl font-bold">
                  {quotes.filter(q => q.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-lg font-bold">
                  {formatCurrency(quotes.reduce((sum, q) => sum + q.totalAmount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cotizaciones</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cotizaciones..."
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
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Válida hasta</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">
                    {quote.quoteNumber}
                  </TableCell>
                  <TableCell>{quote.customerName}</TableCell>
                  <TableCell>{quote.destination}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(quote.departureDate)}</div>
                      <div className="text-gray-500">
                        al {formatDate(quote.returnDate)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(quote.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(quote.status)}>
                      {getStatusText(quote.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(quote.validUntil)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-1">
                      <Link href={`/${tenant}/quotes/${quote.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/${tenant}/quotes/${quote.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
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