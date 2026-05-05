'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Plus, Eye, Edit, MapPin, Clock, DollarSign, Users, Star, Filter, ToggleLeft, ToggleRight } from "lucide-react"
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
import { Loading } from "@/components/shared/loading"
import { formatCurrency } from "@/lib/utils"
import { useApi } from "@/hooks/use-api"
import { travelPlanService } from "@/services/travelPlanService"
import { TravelPlanResponseDto, TravelPlanSearchParams } from "@/types/travel-plan"

export function TravelPlanList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDestination, setFilterDestination] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterMinPrice, setFilterMinPrice] = useState("")
  const [filterMaxPrice, setFilterMaxPrice] = useState("")
  const [filterMinDuration, setFilterMinDuration] = useState("")
  const [filterMaxDuration, setFilterMaxDuration] = useState("")
  const [filterIsActive, setFilterIsActive] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [destinations, setDestinations] = useState<string[]>([])
  const [planTypes, setPlanTypes] = useState<string[]>([])
  const [loadingFilters, setLoadingFilters] = useState(false)
  const pageSize = 12

  // Build search parameters
  const searchParams: TravelPlanSearchParams = {
    searchTerm: searchTerm,
    destination: filterDestination,
    planType: filterType,
    minPrice: filterMinPrice ? parseFloat(filterMinPrice) : 0,
    maxPrice: filterMaxPrice ? parseFloat(filterMaxPrice) : 0,
    minDuration: filterMinDuration ? parseInt(filterMinDuration) : 0,
    maxDuration: filterMaxDuration ? parseInt(filterMaxDuration) : 0,
    isActive: filterIsActive ? filterIsActive === 'true' : false,
    page,
    pageSize
  }

  const { data: travelPlans, loading, error, refetch } = useApi<TravelPlanResponseDto[]>(
    () => travelPlanService.getTravelPlans(searchParams),
    [searchTerm, filterDestination, filterType, filterMinPrice, filterMaxPrice, 
     filterMinDuration, filterMaxDuration, filterIsActive, page]
  )

  // Load destinations and plan types for filters
  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    setLoadingFilters(true)
    try {
      const [destinationsData, planTypesData] = await Promise.all([
        travelPlanService.getDestinations(),
        travelPlanService.getPlanTypes()
      ])
      setDestinations(destinationsData)
      setPlanTypes(planTypesData)
    } catch (error) {
      console.error('Error loading filter options:', error)
    } finally {
      setLoadingFilters(false)
    }
  }

  const handleToggleStatus = async (planId: string) => {
    try {
      await travelPlanService.toggleTravelPlanStatus(planId)
      refetch() // Refresh the list
    } catch (error) {
      console.error('Error toggling plan status:', error)
      alert('Error al cambiar el estado del plan')
    }
  }

  const clearFilters = () => {
    setFilterDestination("")
    setFilterType("")
    setFilterMinPrice("")
    setFilterMaxPrice("")
    setFilterMinDuration("")
    setFilterMaxDuration("")
    setFilterIsActive("")
    setPage(1)
  }

  if (loading) return <Loading message="Cargando planes de viaje..." />

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
  const totalPlans = travelPlans?.length || 0
  const activePlans = travelPlans?.filter(p => p.isActive).length || 0
  const averagePrice = totalPlans > 0 
    ? travelPlans!.reduce((sum, p) => sum + p.price, 0) / totalPlans 
    : 0
  const averageRating = totalPlans > 0 
    ? travelPlans!.reduce((sum, p) => sum + (p.averageRating || 0), 0) / totalPlans 
    : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planes de Viaje</h1>
          <p className="text-gray-600">Gestiona tu catálogo de planes turísticos</p>
        </div>
        <Link href={`/travel-plans/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Plan
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Planes</p>
                <p className="text-2xl font-bold">{totalPlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Planes Activos</p>
                <p className="text-2xl font-bold">{activePlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Precio Promedio</p>
                <p className="text-lg font-bold">
                  {formatCurrency(averagePrice)}
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
                  {averageRating.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Catálogo de Planes</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar planes por nombre, destino o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            {showFilters && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Destino</label>
                    <Select value={filterDestination} onValueChange={setFilterDestination}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los destinos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos los destinos</SelectItem>
                        {destinations.map(dest => (
                          <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de Plan</label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos los tipos</SelectItem>
                        {planTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
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
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="true">Activos</SelectItem>
                        <SelectItem value="false">Inactivos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Precio Mínimo</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filterMinPrice}
                      onChange={(e) => setFilterMinPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Precio Máximo</label>
                    <Input
                      type="number"
                      placeholder="Sin límite"
                      value={filterMaxPrice}
                      onChange={(e) => setFilterMaxPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duración Mín (días)</label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={filterMinDuration}
                      onChange={(e) => setFilterMinDuration(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duración Máx (días)</label>
                    <Input
                      type="number"
                      placeholder="Sin límite"
                      value={filterMaxDuration}
                      onChange={(e) => setFilterMaxDuration(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={clearFilters}>
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelPlans?.map((plan) => (
              <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 relative">
                  <div className="absolute top-4 left-4">
                    <Badge className={plan.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {plan.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  {plan.averageRating && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center bg-white/90 rounded px-2 py-1">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{plan.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{plan.destinationId}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{plan.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {plan.duration} días
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {plan.totalQuotes || 0} cotizaciones
                      </div>
                    </div>

                    <div>
                      <Badge variant="outline" className="mb-2">
                        {plan.planType}
                      </Badge>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Desde</p>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(plan.price)}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(plan.id)}
                            title={plan.isActive ? "Desactivar plan" : "Activar plan"}
                          >
                            {plan.isActive ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Link href={`/travel-plans/${plan.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/travel-plans/${plan.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {travelPlans?.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay planes</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron planes que coincidan con los filtros aplicados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}