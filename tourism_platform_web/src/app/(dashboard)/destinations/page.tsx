'use client'

import { useState } from 'react'
import { Plus, Search, Filter, MapPin, Globe, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDestinations } from '@/hooks/useDestinations'
import { useDestinationFilters } from '@/hooks/useDestinationFilter'
import { DestinationSearchParams } from '@/types/destination'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function DestinationsPage() {

  const [searchParams, setSearchParams] = useState<DestinationSearchParams>({
    page: 1,
    pageSize: 12
  })

  const { data: destinations, loading, error, refetch } = useDestinations(searchParams)
  const { countries, regions } = useDestinationFilters()

  const destinationsList = destinations || []

  const handleSearch = (query: string) => {
    setSearchParams(prev => ({
      ...prev,
      query,
      page: 1
    }))
  }

  const handleCountryFilter = (country: string) => {
    setSearchParams(prev => ({
      ...prev,
      country: country || undefined,
      page: 1
    }))
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch}>Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Destinos</h1>
          <p className="text-gray-600">Gestiona los destinos disponibles para tus planes de viaje</p>
        </div>
        <Link href={`/destinations/new`}>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Destino
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Destinos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{destinationsList.length}</div>
            <p className="text-xs text-muted-foreground">destinos activos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Países</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countries.length}</div>
            <p className="text-xs text-muted-foreground">países disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regiones</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regions.length}</div>
            <p className="text-xs text-muted-foreground">regiones cubiertas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar destinos..."
            className="pl-10"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        <select
          className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          onChange={(e) => handleCountryFilter(e.target.value)}
        >
          <option value="">Todos los países</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : destinationsList.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay destinos</h3>
          <p className="text-gray-600 mb-4">
            {searchParams.query ? 'No se encontraron destinos con tu búsqueda' : 'Comienza agregando tu primer destino'}
          </p>
          <Link href={`/destinations/new`}>
            <Button>Agregar Destino</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinationsList.map((destination) => (
            <Link key={destination.id} href={`/destinations/${destination.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{destination.city}</CardTitle>
                      <Card className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {destination.country}
                      </Card>
                    </div>
                    <Badge variant={destination.isActive ? "default" : "secondary"}>
                      {destination.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {destination.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {destination.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {destination.region && (
                      <Badge variant="outline" className="text-xs">
                        <Building2 className="w-3 h-3 mr-1" />
                        {destination.region}
                      </Badge>
                    )}
                    {destination.countryCode && (
                      <Badge variant="outline" className="text-xs">
                        {destination.countryCode}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination - Simple implementation */}
      {destinationsList.length >= (searchParams.pageSize || 12) && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => setSearchParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
          >
            Cargar más
          </Button>
        </div>
      )}
    </div>
  )
}