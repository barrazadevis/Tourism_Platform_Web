'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from "lucide-react"
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
import { destinationService } from "@/services/destinationService"
import { 
  TravelPlanResponseDto, 
  CreateTravelPlanDto, 
  UpdateTravelPlanDto,
  DifficultyLevel 
} from "@/types/travel-plan"
import { DestinationResponseDto } from "@/types/destination"

interface TravelPlanFormProps {
  planId?: string // For editing
  isEditing?: boolean
}

export function TravelPlanForm({ planId, isEditing = false }: TravelPlanFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateTravelPlanDto>({
    name: "",
    description: "",
    destinationId: "",
    planType: "",
    duration: 1,
    price: 0,
    currency: "COP",
    maxGroupSize: 1,
    minAge: 0,
    maxAge: undefined,
    difficultyLevel: DifficultyLevel.Easy,
    includesAccommodation: false,
    includesTransportation: false,
    includesMeals: false,
    includesGuide: false,
    imageUrl: "",
    highlights: [],
    inclusions: [],
    exclusions: [],
    itinerary: []
  })

  const [newHighlight, setNewHighlight] = useState("")
  const [newInclusion, setNewInclusion] = useState("")
  const [newExclusion, setNewExclusion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [destinations, setDestinations] = useState<DestinationResponseDto[]>([])
  const [planTypes, setPlanTypes] = useState<string[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)

  // Load existing plan data if editing
  const { data: existingPlan, loading: loadingPlan, error } = useApi<TravelPlanResponseDto>(
    () => planId ? travelPlanService.getTravelPlanById(planId) : Promise.resolve(null as any),
    [planId]
  )

  // Load form options
  useEffect(() => {
    loadFormOptions()
  }, [])

  // Set form data when editing
  useEffect(() => {
    if (isEditing && existingPlan) {
      setFormData({
        name: existingPlan.name,
        description: existingPlan.description,
        destinationId: existingPlan.destinationId,
        planType: existingPlan.planType,
        duration: existingPlan.duration,
        price: existingPlan.price,
        currency: existingPlan.currency,
        maxGroupSize: existingPlan.maxGroupSize,
        minAge: existingPlan.minAge,
        maxAge: existingPlan.maxAge,
        difficultyLevel: existingPlan.difficultyLevel as DifficultyLevel,
        includesAccommodation: existingPlan.includesAccommodation,
        includesTransportation: existingPlan.includesTransportation,
        includesMeals: existingPlan.includesMeals,
        includesGuide: existingPlan.includesGuide,
        imageUrl: existingPlan.imageUrl || "",
        highlights: existingPlan.highlights || [],
        inclusions: existingPlan.inclusions || [],
        exclusions: existingPlan.exclusions || [],
        itinerary: existingPlan.itinerary || []
      })
    }
  }, [isEditing, existingPlan])

  const loadFormOptions = async () => {
    setLoadingOptions(true)
    try {
      const [destinationsData, planTypesData] = await Promise.all([
        destinationService.getDestinations(),
        travelPlanService.getPlanTypes()
      ]) 
      
      // Filtrar datos vacíos antes de establecer en el estado
      setDestinations(destinationsData.filter(dest => dest && dest != null))
      setPlanTypes(planTypesData.filter(type => type && type.trim() !== ''))
    } catch (error) {
      console.error('Error loading form options:', error)
      setDestinations([])
      setPlanTypes([])
    } finally {
      setLoadingOptions(false)
    }
  }

  // Highlight management
  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }))
      setNewHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }))
  }

  // Inclusion management
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

  // Exclusion management
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEditing && planId) {
        const updateData: UpdateTravelPlanDto = formData
        await travelPlanService.updateTravelPlan(planId, updateData)
      } else {
        await travelPlanService.createTravelPlan(formData)
      }
      router.push(`/travel-plans`)
    } catch (error) {
      console.error('Error saving travel plan:', error)
      alert('Error al guardar el plan de viaje. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingPlan) return <Loading message="Cargando plan de viaje..." />

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
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
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "Editar Plan de Viaje" : "Nuevo Plan de Viaje"}
            </h1>
            <p className="text-gray-600">
              {isEditing ? "Actualiza la información del plan" : "Crea un nuevo plan turístico"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Precio del Plan</p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(formData.price)}
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
                <label className="text-sm font-medium mb-2 block">Nombre del Plan *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Cartagena Mágica"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Destino *</label>
                {loadingOptions ? (
                  <Input placeholder="Cargando destinos..." disabled />
                ) : (
                  <Select
                    value={formData.destinationId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, destinationId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations
                        .filter(dest => dest && dest.id !== '') // Filtrar valores vacíos
                        .map(dest => (
                          <SelectItem key={dest.id} value={dest.id}>{dest.city}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px] resize-none"
                placeholder="Describe el plan de viaje detalladamente..."
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Duración (días) *</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, duration: parseInt(e.target.value) || 1 
                  }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Precio *</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, price: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Moneda</label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COP">COP</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Grupo Máximo</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.maxGroupSize}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, maxGroupSize: parseInt(e.target.value) || 1 
                  }))}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">URL de Imagen</label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Services Included */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios Incluidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.includesAccommodation}
                  onChange={(e) => setFormData(prev => ({ ...prev, includesAccommodation: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Incluye Alojamiento</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.includesTransportation}
                  onChange={(e) => setFormData(prev => ({ ...prev, includesTransportation: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Incluye Transporte</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.includesMeals}
                  onChange={(e) => setFormData(prev => ({ ...prev, includesMeals: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Incluye Comidas</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.includesGuide}
                  onChange={(e) => setFormData(prev => ({ ...prev, includesGuide: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Incluye Guía</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card>
          <CardHeader>
            <CardTitle>Destacados del Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="Agregar destacado..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              />
              <Button type="button" onClick={addHighlight}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.highlights.map((highlight, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 border-blue-200"
                >
                  <span>{highlight}</span>
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
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
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                placeholder="Agregar inclusión..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
              />
              <Button type="button" onClick={addInclusion}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.inclusions.map((inclusion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 border-green-200"
                >
                  <span>{inclusion}</span>
                  <button
                    type="button"
                    onClick={() => removeInclusion(index)}
                    className="ml-1 text-green-500 hover:text-green-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exclusions */}
        <Card>
          <CardHeader>
            <CardTitle>Qué NO Incluye</CardTitle>
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
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Actualizar Plan" : "Crear Plan"}
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/travel-plans`)}
            className="flex-1"
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}