'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star,
  Users,
  Edit,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  ToggleLeft,
  ToggleRight,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loading } from "@/components/shared/loading"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useApi } from "@/hooks/use-api"
import { travelPlanService } from "@/services/travelPlanService"
import { TravelPlanResponseDto, DifficultyLevel } from "@/types/travel-plan"

interface TravelPlanDetailProps {
  planId: string
}

export function TravelPlanDetail({ planId }: TravelPlanDetailProps) {
  const router = useRouter()
  const [isToggling, setIsToggling] = useState(false)

  const { data: plan, loading, error, refetch } = useApi<TravelPlanResponseDto>(
    () => travelPlanService.getTravelPlanById(planId),
    [planId]
  )

  const handleToggleStatus = async () => {
    if (!plan) return
    
    setIsToggling(true)
    try {
      await travelPlanService.toggleTravelPlanStatus(planId)
      refetch() // Refresh the plan data
    } catch (error) {
      console.error('Error toggling plan status:', error)
      alert('Error al cambiar el estado del plan')
    } finally {
      setIsToggling(false)
    }
  }

  const getDifficultyText = (level: string) => {
    switch (level) {
      case DifficultyLevel.Easy: return 'Fácil'
      case DifficultyLevel.Moderate: return 'Moderado'
      case DifficultyLevel.Challenging: return 'Desafiante'
      case DifficultyLevel.Expert: return 'Experto'
      default: return level
    }
  }

  if (loading) return <Loading message="Cargando plan de viaje..." />

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

  if (!plan) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Plan de viaje no encontrado</p>
        <Button onClick={() => router.push(`/travel-plans`)} variant="outline" className="mt-2">
          Volver a Planes
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/travel-plans`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{plan.name}</h1>
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {plan.destinationId}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={handleToggleStatus}
            disabled={isToggling}
            title={plan.isActive ? "Desactivar plan" : "Activar plan"}
          >
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : plan.isActive ? (
              <ToggleRight className="h-5 w-5 text-green-600" />
            ) : (
              <ToggleLeft className="h-5 w-5 text-gray-400" />
            )}
          </Button>
          <Link href={`/travel-plans/${planId}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar Plan
            </Button>
          </Link>
          <Badge className={plan.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
            {plan.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Duración</p>
                <p className="text-2xl font-bold">{plan.duration} días</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Precio</p>
                <p className="text-xl font-bold">{formatCurrency(plan.price)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Grupo Máximo</p>
                <p className="text-2xl font-bold">{plan.maxGroupSize}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Cotizaciones</p>
                <p className="text-2xl font-bold">{plan.totalQuotes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold">{plan.averageRating?.toFixed(1) || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{plan.description}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Tipo de Plan</p>
                  <Badge variant="outline" className="mt-1">{plan.planType}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dificultad</p>
                  <Badge variant="outline" className="mt-1">{getDifficultyText(plan.difficultyLevel)}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Edad Mínima</p>
                  <p className="font-medium">{plan.minAge} años</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Moneda</p>
                  <p className="font-medium">{plan.currency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          {plan.highlights && plan.highlights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Destacados del Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plan.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Services Included */}
          <Card>
            <CardHeader>
              <CardTitle>Servicios Incluidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`h-5 w-5 ${plan.includesAccommodation ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-sm ${plan.includesAccommodation ? 'text-gray-700' : 'text-gray-400'}`}>
                    Alojamiento
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`h-5 w-5 ${plan.includesTransportation ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-sm ${plan.includesTransportation ? 'text-gray-700' : 'text-gray-400'}`}>
                    Transporte
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`h-5 w-5 ${plan.includesMeals ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-sm ${plan.includesMeals ? 'text-gray-700' : 'text-gray-400'}`}>
                    Comidas
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`h-5 w-5 ${plan.includesGuide ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-sm ${plan.includesGuide ? 'text-gray-700' : 'text-gray-400'}`}>
                    Guía
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itinerary */}
          {plan.itinerary && plan.itinerary.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Itinerario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plan.itinerary.map((day, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">Día {day.day}</Badge>
                        <h4 className="font-medium">{day.title}</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{day.description}</p>
                      {day.activities && day.activities.length > 0 && (
                        <div className="text-xs text-gray-600">
                          <strong>Actividades:</strong> {day.activities.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Inclusions and Exclusions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <CheckCircle className="mr-2 h-5 w-5" />
                Qué Incluye
              </CardTitle>
            </CardHeader>
            <CardContent>
              {plan.inclusions && plan.inclusions.length > 0 ? (
                <ul className="space-y-2">
                  {plan.inclusions.map((inclusion, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{inclusion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No hay inclusiones definidas</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <XCircle className="mr-2 h-5 w-5" />
                Qué NO Incluye
              </CardTitle>
            </CardHeader>
            <CardContent>
              {plan.exclusions && plan.exclusions.length > 0 ? (
                <ul className="space-y-2">
                  {plan.exclusions.map((exclusion, index) => (
                    <li key={index} className="flex items-start">
                      <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{exclusion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No hay exclusiones definidas</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Creado el</p>
                <p className="font-medium">{formatDate(plan.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Última actualización</p>
                <p className="font-medium">{formatDate(plan.updatedAt)}</p>
              </div>
              {plan.imageUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Imagen del plan</p>
                  <img 
                    src={plan.imageUrl} 
                    alt={plan.name}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/quotes/new?planId=${planId}`}>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Crear Cotización
                </Button>
              </Link>
              <Link href={`/quotes?planId=${planId}`}>
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Ver Cotizaciones
                </Button>
              </Link>
              <Link href={`/bookings?planId=${planId}`}>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Reservas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}