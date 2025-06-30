'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PlanService {
  id: string
  serviceType: string
  name: string
  description: string
  price: number
  isIncluded: boolean
  isOptional: boolean
}

interface TravelPlanFormData {
  name: string
  description: string
  destination: string
  durationDays: number
  basePrice: number
  planType: string
  inclusions: string[]
  exclusions: string[]
  services: PlanService[]
}

interface TravelPlanFormProps {
  tenant: string
  isEditing?: boolean
  initialData?: Partial<TravelPlanFormData>
}

export function TravelPlanForm({ tenant, isEditing = false, initialData }: TravelPlanFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<TravelPlanFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    destination: initialData?.destination || "",
    durationDays: initialData?.durationDays || 1,
    basePrice: initialData?.basePrice || 0,
    planType: initialData?.planType || "",
    inclusions: initialData?.inclusions || [],
    exclusions: initialData?.exclusions || [],
    services: initialData?.services || []
  })

  const [newInclusion, setNewInclusion] = useState("")
  const [newExclusion, setNewExclusion] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setFormData(prev => ({
        ...prev,
        inclusions: [...prev.inclusions, newInclusion.trim()]
      }))
      setNewInclusion("")
    }
  }

  const removeInclusion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index)
    }))
  }

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setFormData(prev => ({
        ...prev,
        exclusions: [...prev.exclusions, newExclusion.trim()]
      }))
      setNewExclusion("")
    }
  }

  const removeExclusion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index)
    }))
  }

  const addService = () => {
    const newService: PlanService = {
      id: Date.now().toString(),
      serviceType: "Alojamiento",
      name: "",
      description: "",
      price: 0,
      isIncluded: true,
      isOptional: false
    }
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }))
  }

  const updateService = (id: string, field: keyof PlanService, value: any) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === id ? { ...service, [field]: value } : service
      )
    }))
  }

  const removeService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== id)
    }))
  }

  const calculateTotalPrice = () => {
    const includedServicesPrice = formData.services
      .filter(s => s.isIncluded)
      .reduce((sum, s) => sum + s.price, 0)
    return formData.basePrice + includedServicesPrice
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Saving travel plan:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push(`/${tenant}/travel-plans`)
    } catch (error) {
      console.error('Error saving travel plan:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "Editar Plan de Viaje" : "Nuevo Plan de Viaje"}
            </h1>
            <p className="text-gray-600">
              {isEditing ? "Actualiza la información del plan" : "Crea un nuevo plan turístico"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Precio Total Estimado</p>
          <p className="text-2xl font-bold text-primary">
            ${calculateTotalPrice().toLocaleString()}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nombre del Plan *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Cartagena Mágica"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Destino *</label>
                <Input
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder="Ej: Cartagena, Colombia"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px] resize-none"
                placeholder="Describe el plan de viaje detalladamente..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Duración (días) *</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.durationDays}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, durationDays: parseInt(e.target.value) || 1 
                  }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Precio Base *</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.basePrice}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, basePrice: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tipo de Plan *</label>
                <select
                  value={formData.planType}
                  onChange={(e) => setFormData(prev => ({ ...prev, planType: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Ciudad Colonial">Ciudad Colonial</option>
                  <option value="Playa y Descanso">Playa y Descanso</option>
                  <option value="Cultura y Modernidad">Cultura y Modernidad</option>
                  <option value="Aventura y Naturaleza">Aventura y Naturaleza</option>
                  <option value="Gastronomía">Gastronomía</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Servicios del Plan</CardTitle>
              <Button type="button" onClick={addService} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Servicio
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {formData.services.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay servicios agregados. Haz clic en "Agregar Servicio" para comenzar.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Servicio #{service.id}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Tipo de Servicio</label>
                        <select
                          value={service.serviceType}
                          onChange={(e) => updateService(service.id, 'serviceType', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="Alojamiento">Alojamiento</option>
                          <option value="Transporte">Transporte</option>
                          <option value="Alimentación">Alimentación</option>
                          <option value="Actividades">Actividades</option>
                          <option value="Seguros">Seguros</option>
                          <option value="Guías">Guías</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Nombre del Servicio</label>
                        <Input
                          value={service.name}
                          onChange={(e) => updateService(service.id, 'name', e.target.value)}
                          placeholder="Ej: Hotel 4 estrellas"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Precio</label>
                        <Input
                          type="number"
                          min="0"
                          value={service.price}
                          onChange={(e) => updateService(service.id, 'price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Descripción</label>
                      <Input
                        value={service.description}
                        onChange={(e) => updateService(service.id, 'description', e.target.value)}
                        placeholder="Describe el servicio detalladamente..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={service.isIncluded}
                          onChange={(e) => updateService(service.id, 'isIncluded', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Incluido en el precio base</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={service.isOptional}
                          onChange={(e) => updateService(service.id, 'isOptional', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Servicio opcional</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inclusions */}
        <Card>
          <CardHeader>
            <CardTitle>Qué Incluye</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newExclusion}
                onChange={(e) => setNewExclusion(e.target.value)}
                placeholder="Agregar exclusión..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExclusion())}
              />
              <Button type="button" onClick={addExclusion}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.exclusions.map((exclusion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 border-red-200"
                >
                  <span>{exclusion}</span>
                  <button
                    type="button"
                    onClick={() => removeExclusion(index)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Guardando..." : isEditing ? "Actualizar Plan" : "Crear Plan"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/${tenant}/travel-plans`)}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}