'use client'

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Eye, Edit, MapPin, Clock, DollarSign, Users, Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface TravelPlan {
  id: string
  name: string
  description: string
  destination: string
  durationDays: number
  basePrice: number
  planType: string
  inclusions: string[]
  exclusions: string[]
  isActive: boolean
  totalQuotes: number
  rating: number
  imageUrl: string
  createdAt: string
}

// Datos de ejemplo
const mockTravelPlans: TravelPlan[] = [
  {
    id: "1",
    name: "Cartagena Mágica",
    description: "Descubre la ciudad amurallada más hermosa de Colombia con este plan completo de 4 días y 3 noches.",
    destination: "Cartagena, Colombia",
    durationDays: 4,
    basePrice: 850000,
    planType: "Ciudad Colonial",
    inclusions: [
      "3 noches de alojamiento",
      "Desayunos incluidos",
      "City tour centro histórico",
      "Visita a las murallas",
      "Traslados aeropuerto"
    ],
    exclusions: [
      "Tiquetes aéreos",
      "Almuerzos y cenas",
      "Actividades opcionales",
      "Gastos personales"
    ],
    isActive: true,
    totalQuotes: 25,
    rating: 4.8,
    imageUrl: "/cartagena.jpg",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "San Andrés Paraíso",
    description: "Relájate en las playas más cristalinas del Caribe colombiano con este paquete todo incluido.",
    destination: "San Andrés, Colombia",
    durationDays: 5,
    basePrice: 1200000,
    planType: "Playa y Descanso",
    inclusions: [
      "4 noches todo incluido",
      "Vuelos nacionales",
      "Traslados en la isla",
      "Tour acuático",
      "Seguro de viaje"
    ],
    exclusions: [
      "Actividades acuáticas extremas",
      "Excursiones a islotes",
      "Gastos personales"
    ],
    isActive: true,
    totalQuotes: 18,
    rating: 4.9,
    imageUrl: "/sanandres.jpg",
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    name: "Medellín Ciudad Innovadora",
    description: "Conoce la transformación de Medellín con tours por comunas, museos y vida nocturna.",
    destination: "Medellín, Colombia",
    durationDays: 3,
    basePrice: 650000,
    planType: "Cultura y Modernidad",
    inclusions: [
      "2 noches de hotel",
      "Tour por comunas",
      "Visita Museo de Antioquia",
      "Metrocable incluido",
      "Guía especializado"
    ],
    exclusions: [
      "Tiquetes aéreos",
      "Comidas",
      "Tour Pablo Escobar",
      "Actividades nocturnas"
    ],
    isActive: false,
    totalQuotes: 8,
    rating: 4.5,
    imageUrl: "/medellin.jpg",
    createdAt: "2024-02-01"
  }
]

interface TravelPlanListProps {
  tenant: string
}

export function TravelPlanList({ tenant }: TravelPlanListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDestination, setFilterDestination] = useState("")
  const [filterType, setFilterType] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [travelPlans] = useState<TravelPlan[]>(mockTravelPlans)

  const filteredPlans = travelPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDestination = !filterDestination || plan.destination.includes(filterDestination)
    const matchesType = !filterType || plan.planType === filterType
    
    return matchesSearch && matchesDestination && matchesType
  })

  const destinations = [...new Set(travelPlans.map(plan => plan.destination))]
  const planTypes = [...new Set(travelPlans.map(plan => plan.planType))]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planes de Viaje</h1>
          <p className="text-gray-600">Gestiona tu catálogo de planes turísticos</p>
        </div>
        <Link href={`/${tenant}/travel-plans/new`}>
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
                <p className="text-2xl font-bold">{travelPlans.length}</p>
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
                <p className="text-2xl font-bold">
                  {travelPlans.filter(p => p.isActive).length}
                </p>
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
                  {formatCurrency(
                    travelPlans.reduce((sum, p) => sum + p.basePrice, 0) / travelPlans.length
                  )}
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
                  {(travelPlans.reduce((sum, p) => sum + p.rating, 0) / travelPlans.length).toFixed(1)}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium">Destino</label>
                  <select
                    value={filterDestination}
                    onChange={(e) => setFilterDestination(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Todos los destinos</option>
                    {destinations.map(dest => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo de Plan</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Todos los tipos</option>
                    {planTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterDestination("")
                      setFilterType("")
                    }}
                    className="w-full"
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 relative">
                  <div className="absolute top-4 left-4">
                    <Badge className={plan.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {plan.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center bg-white/90 rounded px-2 py-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{plan.rating}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{plan.destination}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {plan.durationDays} días
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {plan.totalQuotes} cotizaciones
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
                            {formatCurrency(plan.basePrice)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/${tenant}/travel-plans/${plan.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/${tenant}/travel-plans/${plan.id}/edit`}>
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

          {filteredPlans.length === 0 && (
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