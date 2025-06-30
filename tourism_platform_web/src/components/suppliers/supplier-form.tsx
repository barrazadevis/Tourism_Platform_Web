'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface SupplierService {
  id: string
  serviceType: string
  serviceName: string
  description: string
  cost: number
  currency: string
  isActive: boolean
}

interface SupplierFormData {
  name: string
  contactEmail: string
  contactPhone: string
  address: string
  city: string
  country: string
  supplierType: string
  services: SupplierService[]
}

interface SupplierFormProps {
  tenant: string
  isEditing?: boolean
  initialData?: Partial<SupplierFormData>
}

export function SupplierForm({ tenant, isEditing = false, initialData }: SupplierFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<SupplierFormData>({
    name: initialData?.name || "",
    contactEmail: initialData?.contactEmail || "",
    contactPhone: initialData?.contactPhone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    country: initialData?.country || "Colombia",
    supplierType: initialData?.supplierType || "",
    services: initialData?.services || []
  })

  const [isLoading, setIsLoading] = useState(false)

  const addService = () => {
    const newService: SupplierService = {
      id: Date.now().toString(),
      serviceType: "Alojamiento",
      serviceName: "",
      description: "",
      cost: 0,
      currency: "COP",
      isActive: true
    }
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }))
  }

  const updateService = (id: string, field: keyof SupplierService, value: any) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Saving supplier:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push(`/${tenant}/suppliers`)
    } catch (error) {
      console.error('Error saving supplier:', error)
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
            onClick={() => router.push(`/${tenant}/suppliers`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
            </h1>
            <p className="text-gray-600">
              {isEditing ? "Actualiza la información del proveedor" : "Registra un nuevo proveedor"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Proveedor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nombre de la Empresa *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Hotels Caribe Premium"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tipo de Proveedor *</label>
                <select
                  value={formData.supplierType}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplierType: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Alojamiento">Alojamiento</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Actividades">Actividades</option>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Seguros">Seguros</option>
                  <option value="Guías">Guías Turísticos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email de Contacto *</label>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="contacto@proveedor.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Teléfono de Contacto</label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="+57 5 123 4567"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Dirección</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Calle 10 #15-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ciudad *</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Cartagena"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">País</label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Servicios Ofrecidos</CardTitle>
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Tipo de Servicio</label>
                        <select
                          value={service.serviceType}
                          onChange={(e) => updateService(service.id, 'serviceType', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="Alojamiento">Alojamiento</option>
                          <option value="Transporte">Transporte</option>
                          <option value="Actividades">Actividades</option>
                          <option value="Alimentación">Alimentación</option>
                          <option value="Seguros">Seguros</option>
                          <option value="Guías">Guías</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Nombre del Servicio</label>
                        <Input
                          value={service.serviceName}
                          onChange={(e) => updateService(service.id, 'serviceName', e.target.value)}
                          placeholder="Ej: Habitación Doble Standard"
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

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Costo</label>
                        <Input
                          type="number"
                          min="0"
                          value={service.cost}
                          onChange={(e) => updateService(service.id, 'cost', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Moneda</label>
                        <select
                          value={service.currency}
                          onChange={(e) => updateService(service.id, 'currency', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="COP">COP - Pesos Colombianos</option>
                          <option value="USD">USD - Dólares</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={service.isActive}
                            onChange={(e) => updateService(service.id, 'isActive', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">Servicio activo</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Guardando..." : isEditing ? "Actualizar Proveedor" : "Crear Proveedor"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/${tenant}/suppliers`)}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}