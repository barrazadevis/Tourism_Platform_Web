'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/shared/loading"
import { customerService, CreateCustomerRequest, CustomerResponse } from "@/services/customers"
import { ApiError } from "@/lib/api"

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
  dateOfBirth: string
  preferredLanguage: string
  notes: string
}

interface CustomerFormProps {
  isEditing?: boolean
  customerId?: string
}

export function CustomerForm({ isEditing = false, customerId }: CustomerFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    documentType: "CC",
    documentNumber: "",
    address: "",
    city: "",
    country: "Colombia",
    dateOfBirth: "",
    preferredLanguage: "es",
    notes: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(isEditing)

  useEffect(() => {
    if (isEditing && customerId) {
      loadCustomer()
    }
  }, [isEditing, customerId])

  const loadCustomer = async () => {
    try {
      const customer = await customerService.getCustomerById(customerId!)
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        documentType: customer.documentType,
        documentNumber: customer.documentNumber,
        address: customer.address,
        city: customer.city,
        country: customer.country,
        dateOfBirth: customer.dateOfBirth || "",
        preferredLanguage: customer.preferredLanguage,
        notes: customer.notes,
      })
    } catch (error) {
      setError('Error al cargar el cliente')
      console.error('Error loading customer:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const customerData: CreateCustomerRequest = {
        ...formData,
        dateOfBirth: formData.dateOfBirth || undefined,
      }

      if (isEditing && customerId) {
        await customerService.updateCustomer(customerId, customerData)
      } else {
        await customerService.createCustomer(customerData)
      }

      router.push(`/customers`)
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Error al guardar el cliente'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (initialLoading) {
    return <Loading message="Cargando información del cliente..." />
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
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Apellidos *</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Dirección</label>
              <Input
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ciudad</label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm font-medium">País</label>
                <Input
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Fecha de Nacimiento</label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Notas</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
                placeholder="Notas adicionales sobre el cliente..."
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear Cliente"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push(`/customers`)}
                disabled={isLoading}
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