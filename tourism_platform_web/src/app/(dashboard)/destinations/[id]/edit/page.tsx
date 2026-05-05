'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useDestination, useDestinationMutations } from '@/hooks/useDestinations'
import { UpdateDestinationDto } from '@/types/destination'
import Link from 'next/link'

export default function EditDestinationPage() {
  const router = useRouter()
  const params = useParams()
  const destinationId = params.id as string

  const { data: destination, loading: loadingDestination } = useDestination(destinationId)
  const { updateDestination, loading, error } = useDestinationMutations()

  const [formData, setFormData] = useState<UpdateDestinationDto & { isActive: boolean }>({
    country: '',
    city: '',
    description: '',
    countryCode: '',
    region: '',
    isActive: true
  })

  useEffect(() => {
    if (destination) {
      setFormData({
        country: destination.country,
        city: destination.city,
        description: destination.description || '',
        countryCode: destination.countryCode || '',
        region: destination.region || '',
        isActive: destination.isActive
      })
    }
  }, [destination])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await updateDestination(destinationId, {
        country: formData.country,
        city: formData.city,
        description: formData.description || undefined,
        countryCode: formData.countryCode || undefined,
        region: formData.region || undefined
      })

      router.push(`/destinations/${destinationId}`)
    } catch (err) {
      console.error('Error updating destination:', err)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loadingDestination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">Destino no encontrado</p>
          <Link href={`/destinations`}>
            <Button>Volver a Destinos</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/destinations/${destinationId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Destino</h1>
          <p className="text-gray-600">Modifica la información del destino</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Destino</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">País *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Ej: Colombia"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Ej: Cartagena"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="countryCode">Código de País</Label>
                <Input
                  id="countryCode"
                  value={formData.countryCode}
                  onChange={(e) => handleInputChange('countryCode', e.target.value.toUpperCase())}
                  placeholder="Ej: CO"
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Región/Estado</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  placeholder="Ej: Bolívar"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe este destino..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Destino activo</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href={`/destinations/${destinationId}`}>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  'Guardando...'
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
