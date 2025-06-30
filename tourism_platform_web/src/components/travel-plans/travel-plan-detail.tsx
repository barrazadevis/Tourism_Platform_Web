'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface TravelPlanDetail {
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
  services: Array<{
    id: string
    serviceType: string
    name: string
    description: string
    price: number
    isIncluded: boolean
    isOptional: boolean
  }>
  createdAt: string
}

const mockPlanDetail: TravelPlanDetail = {
  id: "1",
  name: "Cartagena Mágica",
  description: "Descubre la ciudad amurallada más hermosa de Colombia con este plan completo de 4 días y 3 noches. Sumérgete en la historia colonial, disfruta de la gastronomía caribeña y relájate en las mejores playas.",
  destination: "Cartagena, Colombia",
  durationDays: 4,
  basePrice: 850000,
  planType: "Ciudad Colonial",
  inclusions: [
    "3 noches de alojamiento en hotel 4 estrellas",
    "Desayunos buffet incluidos",
    "City tour por el centro histórico",
    "Visita guiada a las murallas",
    "Traslados aeropuerto-hotel-aeropuerto",
    "Seguro de viaje básico"
  ],
  exclusions: [
    "Tiquetes aéreos",
    "Almuerzos y cenas",
    "Actividades opcionales",
    "Gastos personales",
    "Propinas",
    "Bebidas alcohólicas"
  ],
  isActive: true,
  totalQuotes: 25,
  rating: 4.8,
  services: [
    {
      id: "1",
      serviceType: "Alojamiento",
      name: "Hotel Boutique Centro Histórico",
      description: "Hotel 4 estrellas en el corazón del centro histórico",
      price: 200000,
      isIncluded: true,
      isOptional: false
    },
    {
      id: "2",
      serviceType: "Transporte",
      name: "Traslados Privados",
      description: "Traslados en vehículo privado con aire acondicionado",
      price: 150000,
      isIncluded: true,
      isOptional: false
    },
    {
      id: "3",
      serviceType: "Actividades",
      name: "Tour Islas del Rosario",
      description: "Excursión de día completo a las Islas del Rosario",
      price: 180000,
      isIncluded: false,
      isOptional: true
    }
  ],
  createdAt: "2024-01-15"
}

interface TravelPlanDetailProps {
  tenant: string
  planId: string
}

export function TravelPlanDetail({ tenant, planId }: TravelPlanDetailProps) {
  const router = useRouter()
  const [plan] = useState<TravelPlanDetail>(mockPlanDetail)

  const totalPrice = plan.basePrice + plan.services
    .filter(s => s.isIncluded)
    .reduce((sum, s) => sum + s.price, 0)

  const optionalServices = plan.services.filter(s => s.isOptional)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/${tenant}/travel-plans`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{plan.name}</h1>
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {plan.destination}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar Plan
          </Button>
          <Badge className={plan.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
            {plan.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Duración</p>
                <p className="text-2xl font-bold">{plan.durationDays} días</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Precio Total</p>
                <p className="text-xl font-bold">{formatCurrency(totalPrice)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Cotizaciones</p>
                <p className="text-2xl font-bold">{plan.totalQuotes}</p>
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
                <p className="text-2xl font-bold">{plan.rating}</p>
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
              <CardTitle>Descripción del Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{plan.description}</p>
              <div className="mt-4">
                <Badge variant="outline">{plan.planType}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Servicios Incluidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plan.services.filter(s => s.isIncluded).map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.serviceType}</p>
                      </div>
                      <p className="font-bold text-primary">{formatCurrency(service.price)}</p>
                    </div>
                    <p className="text-sm text-gray-700">{service.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {optionalServices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Servicios Opcionales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optionalServices.map((service) => (
                    <div key={service.id} className="border border-dashed rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-gray-600">{service.serviceType}</p>
                        </div>
                        <p className="font-bold text-gray-600">+{formatCurrency(service.price)}</p>
                      </div>
                      <p className="text-sm text-gray-700">{service.description}</p>
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
              <ul className="space-y-2">
                {plan.inclusions.map((inclusion, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{inclusion}</span>
                  </li>
                ))}
              </ul>
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
              <ul className="space-y-2">
                {plan.exclusions.map((exclusion, index) => (
                  <li key={index} className="flex items-start">
                    <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{exclusion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Crear Cotización
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Ver Calendario
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Ver Cotizaciones
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}