'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Globe, Building2, Calendar, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { useDestination, useDestinationMutations } from '@/hooks/useDestinations'
import Link from 'next/link'

export default function DestinationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const destinationId = params.id as string

  const { data: destination, loading, error } = useDestination(destinationId)
  const { deleteDestination, loading: deleteLoading } = useDestinationMutations()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteDestination(destinationId)
      router.push(`/destinations`)
    } catch (err) {
      console.error('Error deleting destination:', err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Destino no encontrado'}</p>
          <Link href={`/destinations`}>
            <Button>Volver a Destinos</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/destinations`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{destination.city}</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {destination.country}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={destination.isActive ? "default" : "secondary"}>
            {destination.isActive ? "Activo" : "Inactivo"}
          </Badge>
          <Link href={`/destinations/${destinationId}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">País</label>
                  <p className="text-lg">{destination.country}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ciudad</label>
                  <p className="text-lg">{destination.city}</p>
                </div>
              </div>

              {(destination.region || destination.countryCode) && (
                <div className="grid grid-cols-2 gap-4">
                  {destination.region && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Región</label>
                      <p className="text-lg">{destination.region}</p>
                    </div>
                  )}
                  {destination.countryCode && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Código de País</label>
                      <p className="text-lg">{destination.countryCode}</p>
                    </div>
                  )}
                </div>
              )}

              {destination.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Descripción</label>
                  <p className="text-gray-700 leading-relaxed">{destination.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${destination.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="font-medium">
                  {destination.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {destination.isActive 
                  ? 'Este destino está disponible para nuevos planes de viaje'
                  : 'Este destino no está disponible para nuevos planes de viaje'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles Técnicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">ID:</span>
                <span className="text-sm font-mono">{destination.id}</span>
              </div>
              {destination.countryCode && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Código ISO:</span>
                  <span className="text-sm font-mono">{destination.countryCode}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogClose onClose={() => setShowDeleteDialog(false)} />
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              ¿Estás seguro de que quieres eliminar el destino "{destination.city}, {destination.country}"?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
