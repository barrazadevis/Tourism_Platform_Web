'use client'

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  documentNumber: string
  totalQuotes: number
  totalBookings: number
  totalSpent: number
  createdAt: string
}

// Datos de ejemplo
const mockCustomers: Customer[] = [
  {
    id: "1",
    firstName: "María",
    lastName: "González",
    email: "maria@email.com",
    phone: "+57 300 123 4567",
    documentNumber: "12345678",
    totalQuotes: 5,
    totalBookings: 3,
    totalSpent: 4500000,
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    firstName: "Carlos",
    lastName: "Ruiz",
    email: "carlos@email.com",
    phone: "+57 301 987 6543",
    documentNumber: "87654321",
    totalQuotes: 3,
    totalBookings: 2,
    totalSpent: 3200000,
    createdAt: "2024-01-20"
  },
  {
    id: "3",
    firstName: "Ana",
    lastName: "Martínez",
    email: "ana@email.com", 
    phone: "+57 302 555 1234",
    documentNumber: "11223344",
    totalQuotes: 2,
    totalBookings: 1,
    totalSpent: 1800000,
    createdAt: "2024-02-01"
  }
]

interface CustomerListProps {
  tenant: string
}

export function CustomerList({ tenant }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [customers] = useState<Customer[]>(mockCustomers)

  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.documentNumber.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gestiona tu base de clientes</p>
        </div>
        <Link href={`/${tenant}/customers/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
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
                <TableHead>Cliente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead className="text-center">Cotizaciones</TableHead>
                <TableHead className="text-center">Reservas</TableHead>
                <TableHead className="text-right">Total Gastado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {customer.firstName} {customer.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Cliente desde {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.documentNumber}</TableCell>
                  <TableCell className="text-center">{customer.totalQuotes}</TableCell>
                  <TableCell className="text-center">{customer.totalBookings}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-1">
                      <Link href={`/${tenant}/customers/${customer.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/${tenant}/customers/${customer.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
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