'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Truck, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Building, 
  ToggleLeft, 
  ToggleRight, 
  Filter,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loading } from "@/components/shared/loading"
import { formatCurrency } from "@/lib/utils"
import { useApi } from "@/hooks/use-api"
import { supplierService } from "@/services/supplierService"
import { 
  SupplierResponseDto, 
  SupplierSearchParams,
  getSupplierTypeText,
  getSupplierStatusColor,
  getSupplierStatusText,
  getSupplierIcon
} from "@/types/supplier"

export function SupplierList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCity, setFilterCity] = useState("all")
  const [filterIsActive, setFilterIsActive] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [supplierTypes, setSupplierTypes] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({})
  const pageSize = 10

  // Build search parameters
  const searchParams: SupplierSearchParams = {
    searchTerm: searchTerm,
    supplierType: filterType && filterType !== "all" ? filterType : '',
    city: filterCity && filterCity !== "all" ? filterCity : '',
    isActive: filterIsActive && filterIsActive !== "all" ? filterIsActive === "true" : true,
    page,
    pageSize
  }

  const { data: suppliers, loading, error, refetch } = useApi<SupplierResponseDto[]>(
    () => supplierService.getSuppliers(searchParams),
    [searchTerm, filterType, filterCity, filterIsActive, page]
  )

  // Load filter options on component mount
  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    setLoadingOptions(true)
    try {
      const supplierTypesData = await supplierService.getSupplierTypes()
      setSupplierTypes(supplierTypesData.filter(type => type && type.trim() !== ''))
      
      // Extract unique cities from current suppliers data
      if (suppliers) {
        const uniqueCities = [...new Set(suppliers.map(s => s.city).filter(city => city && city.trim() !== ''))]
        setCities(uniqueCities)
      }
    } catch (error) {
      console.error('Error loading filter options:', error)
      setSupplierTypes([])
      setCities([])
    } finally {
      setLoadingOptions(false)
    }
  }

  // Update cities when suppliers data changes
  useEffect(() => {
    if (suppliers) {
      const uniqueCities = [...new Set(suppliers.map(s => s.city).filter(city => city && city.trim() !== ''))]
      setCities(uniqueCities)
    }
  }, [suppliers])

  const handleToggleSupplierStatus = async (supplierId: string) => {
    setToggleStates(prev => ({ ...prev, [supplierId]: true }))
    
    try {
      await supplierService.toggleSupplierStatus(supplierId)
      refetch() // Refresh the suppliers list
    } catch (error) {
      console.error('Error toggling supplier status:', error)
      alert('Error al cambiar el estado del proveedor')
    } finally {
      setToggleStates(prev => ({ ...prev, [supplierId]: false }))
    }
  }

  const clearFilters = () => {
    setFilterType("all")
    setFilterCity("all")
    setFilterIsActive("all")
    setSearchTerm("")
    setPage(1)
  }

  if (loading) return <Loading message="Cargando proveedores..." />

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

  // Calculate stats from actual data
  const totalSuppliers = suppliers?.length || 0
  const activeSuppliers = suppliers?.filter(s => s.isActive).length || 0
  const totalContracts = suppliers?.reduce((sum, s) => sum + (s.totalContracts || 0), 0) || 0
  const averageRating = totalSuppliers > 0 
    ? suppliers!.reduce((sum, s) => sum + (s.averageRating || 0), 0) / totalSuppliers 
    : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
          <p className="text-gray-600">Gestiona tu red de proveedores turísticos</p>
        </div>
        <Link href={`/suppliers/new`}>
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
                <p className="text-2xl font-bold">{totalSuppliers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ToggleRight className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Proveedores Activos</p>
                <p className="text-2xl font-bold">{activeSuppliers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Contratos</p>
                <p className="text-2xl font-bold">{totalContracts}</p>
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
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proveedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Proveedor</label>
                {loadingOptions ? (
                  <Input placeholder="Cargando tipos..." disabled />
                ) : (
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      {supplierTypes.map(type => (
                        <SelectItem key={type} value={type}>{getSupplierTypeText(type)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Ciudad</label>
                <Select value={filterCity} onValueChange={setFilterCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las ciudades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ciudades</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Estado</label>
                <Select value={filterIsActive} onValueChange={setFilterIsActive}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Activos</SelectItem>
                    <SelectItem value="false">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proveedor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Contratos</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers?.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getSupplierIcon(supplier.supplierType)}</span>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-gray-500">
                          {supplier.contactPerson}
                        </div>
                        {supplier.isPreferred && (
                          <Badge variant="outline" className="mt-1 text-xs bg-blue-50 text-blue-700">
                            Preferido
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getSupplierTypeText(supplier.supplierType)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        <a href={`mailto:${supplier.email}`} className="hover:text-blue-600">
                          {supplier.email}
                        </a>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        <a href={`tel:${supplier.phone}`} className="hover:text-blue-600">
                          {supplier.phone}
                        </a>
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
                    <div>
                      <span className="font-medium">{supplier.totalContracts || 0}</span>
                      {supplier.totalBookings && (
                        <div className="text-xs text-gray-500">
                          {supplier.totalBookings} reservas
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">
                        {supplier.averageRating?.toFixed(1) || "N/A"}
                      </span>
                      {supplier.reviewCount && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({supplier.reviewCount})
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleSupplierStatus(supplier.id)}
                      disabled={toggleStates[supplier.id]}
                      className="flex items-center"
                    >
                      {toggleStates[supplier.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : supplier.isActive ? (
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
                      <Link href={`/suppliers/${supplier.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/suppliers/${supplier.id}/edit`}>
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

          {suppliers?.length === 0 && (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proveedores</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron proveedores que coincidan con los filtros aplicados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}