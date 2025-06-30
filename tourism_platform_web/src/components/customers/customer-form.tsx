'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CustomerFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  documentType: string
  documentNumber: string
  address: string
  city: string
  country: string
  notes: string
}

interface CustomerFormProps {
  tenant: string
  isEditing?: boolean
  initialData?: Partial<CustomerFormData>
}

export function CustomerForm({ tenant, isEditing = false, initialData }: CustomerFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    documentType: initialData?.documentType || "CC",
    documentNumber: initialData?.documentNumber || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    country: initialData?.country || "Colombia",
    notes: initialData?.notes || "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement API call
      console.log('Saving customer:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      router.push(`/${tenant}/customers`)
    } catch (error) {
      console.error('Error saving customer:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
        </h1>
        <p className="text-gray-600">
          {isEditing ? "Actualiza la información del cliente" : "Agrega un nuevo cliente a tu base de datos"}
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nombres *</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Apellidos *</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipo de Documento</label>
                <select
                  value={formData.documentType}
                  onChange={(e) => handleChange("documentType", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PP">Pasaporte</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Número de Documento *</label>
                <Input
                  value={formData.documentNumber}
                  onChange={(e) => handleChange("documentNumber", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Dirección</label>
              <Input
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ciudad</label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">País</label>
                <Input
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Notas</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
                placeholder="Notas adicionales sobre el cliente..."
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear Cliente"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push(`/${tenant}/customers`)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
