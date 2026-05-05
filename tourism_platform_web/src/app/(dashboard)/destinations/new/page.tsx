'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useDestinationMutations } from '@/hooks/useDestinations'
import { CreateDestinationDto } from '@/types/destination'
import Link from 'next/link'

export default function NewDestinationPage() {
  const router = useRouter()
  const params = useParams()

  const [formData, setFormData] = useState<CreateDestinationDto>({
    country: '',
    city: '',
    description: '',
    countryCode: '',
    region: ''
  })

  const { createDestination, loading, error } = useDestinationMutations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createDestination({
        ...formData,
        description: formData.description || undefined,
        countryCode: formData.countryCode || undefined,
        region: formData.region || undefined
      })
      
      router.push(`/destinations`)
    } catch (err) {
      // Error is handled by the hook
      console.error('Error creating destination:', err)
    }
  }

  const handleInputChange = (field: keyof CreateDestinationDto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/destinations`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Destino</h1>
          <p className="text-gray-600">Agrega un nuevo destino a tu catálogo</p>
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

            <div className="flex justify-end space-x-4">
              <Link href={`/destinations`}>
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
                    Guardar Destino
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