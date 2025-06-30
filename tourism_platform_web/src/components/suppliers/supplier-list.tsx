'use client'

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Eye, Edit, Truck, Phone, Mail, MapPin, Star, Building, ToggleLeft, ToggleRight } from "lucide-react"
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

interface Supplier {
  id: string
  name: string
  contactEmail: string
  contactPhone: string
  address: string
  city: string
  country: string
  supplierType: string
  isActive: boolean
  rating: number
  totalServices: number
  createdAt: string
  services: Array<{
    id: string
    serviceName: string
    serviceType: string
    cost: number
    currency: string
  }>
}

// Datos de ejemplo
const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Hotels Caribe Premium",
    contactEmail: "reservas@hotelcaribe.com",
    contactPhone: "+57 5 665 0000",
    address: "Av. San Martín #4-60",
    city: "Cartagena",
    country: "Colombia",
    supplierType: "Alojamiento",
    isActive: true,
    rating: 4.8,
    totalServices: 5,
    createdAt: "2024-01-15",
    services: [
      {
        id: "1",
        serviceName: "Habitación Doble Standard",
        serviceType: "Alojamiento",
        cost: 280000,
        currency: "COP"
      },
      {
        id: "2", 
        serviceName: "Suite Junior",
        serviceType: "Alojamiento",
        cost: 450000,
        currency: "COP"
      }
    ]
  },
  {
    id: "2",
    name: "Transportes Turísticos del Caribe",
    contactEmail: "info@transportescaribe.com",
    contactPhone: "+57 5 664 2222",
    address: "Calle 30 #20-45",
    city: "Cartagena",
    country: "Colombia",
    supplierType: "Transporte",
    isActive: true,
    rating: 4.5,
    totalServices: 3,
    createdAt: "2024-01-10",
    services: [
      {
        id: "3",
        serviceName: "Traslado Aeropuerto",
        serviceType: "Transporte",
        cost: 45000,
        currency: "COP"
      },
      {
        id: "4",
        serviceName: "City Tour",
        serviceType: "Transporte",
        cost: 85000,
        currency: "COP"
      }
    ]
  },
  {
    id: "3",
    name: "Aventuras San Andrés",
    contactEmail: "ventas@aventurassanandres.com",
    contactPhone: "+57 8 512 3333",
    address: "Av. Circunvalar #12-34",
    city: "San Andrés",
    country: "Colombia",
    supplierType: "Actividades",
    isActive: false,
    rating: 4.2,
    totalServices: 8,
    createdAt: "2024-02-01",
    services: [
      {
        id: "5",
        serviceName: "Tour Acuático",
        serviceType: "Actividades",
        cost: 120000,
        currency: "COP"
      },
      {
        id: "6",
        serviceName: "Snorkeling",
        serviceType: "Actividades", 
        cost: 75000,
        currency: "COP"
      }
    ]
  }
]

interface SupplierListProps {
  tenant: string
}

export function SupplierList({ tenant }: SupplierListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterCity, setFilterCity] = useState("")
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = !filterType || supplier.supplierType === filterType
    const matchesCity = !filterCity || supplier.city === filterCity
    
    return matchesSearch && matchesType && matchesCity
  })

  const supplierTypes = [...new Set(suppliers.map(s => s.supplierType))]
  const cities = [...new Set(suppliers.map(s => s.city))]

  const toggleSupplierStatus = (id: string) => {
    setSuppliers(prev => prev.map(supplier =>
      supplier.id === id ? { ...supplier, isActive: !supplier.isActive } : supplier
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
          <p className="text-gray-600">Gestiona tu red de proveedores turísticos</p>
        </div>
        <Link href={`/${tenant}/suppliers/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proveedor
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Proveedores</p>
                <p className="text-2xl font-bold">{suppliers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ToggleRight className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold">
                  {suppliers.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Servicios</p>
                <p className="text-2xl font-bold">
                  {suppliers.reduce((sum, s) => sum + s.totalServices, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Rating Promedio</p>
                <p className="text-2xl font-bold">
                  {(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proveedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Todos los tipos</option>
              {supplierTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Todas las ciudades</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proveedor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Servicios</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-sm text-gray-500">
                        Desde {new Date(supplier.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{supplier.supplierType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {supplier.contactEmail}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {supplier.contactPhone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      <div>
                        <div>{supplier.city}</div>
                        <div className="text-gray-500">{supplier.country}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{supplier.totalServices}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{supplier.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleSupplierStatus(supplier.id)}
                      className="flex items-center"
                    >
                      {supplier.isActive ? (
                        <>
                          <ToggleRight className="h-5 w-5 text-green-600 mr-1" />
                          <span className="text-green-600 text-sm">Activo</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-5 w-5 text-gray-400 mr-1" />
                          <span className="text-gray-400 text-sm">Inactivo</span>
                        </>
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-1">
                      <Link href={`/${tenant}/suppliers/${supplier.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/${tenant}/suppliers/${supplier.id}/edit`}>
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