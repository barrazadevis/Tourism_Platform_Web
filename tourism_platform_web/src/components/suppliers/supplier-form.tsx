'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { supplierService } from "@/services/supplierService"
import { 
  SupplierResponseDto, 
  CreateSupplierDto, 
  UpdateSupplierDto,
  SupplierType,
  PaymentTerms,
  getSupplierTypeText,
  getPaymentTermsText
} from "@/types/supplier"

interface SupplierFormProps {
  tenant: string
  supplierId?: string // For editing
  isEditing?: boolean
}

export function SupplierForm({ tenant, supplierId, isEditing = false }: SupplierFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateSupplierDto>({
    name: "",
    supplierType: "",
    description: "",
    contactPerson: "",
    email: "",
    phone: "",
    alternativePhone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "Colombia",
    postalCode: "",
    taxId: "",
    bankAccount: "",
    paymentTerms: PaymentTerms.Net30,
    creditLimit: 0,
    currency: "COP",
    isPreferred: false,
    notes: "",
    tags: []
  })

  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [supplierTypes, setSupplierTypes] = useState<string[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)

  // Load existing supplier data if editing
  const { data: existingSupplier, loading: loadingSupplier, error } = useApi<SupplierResponseDto>(
    () => supplierId ? supplierService.getSupplierById(supplierId) : Promise.resolve(null as any),
    [supplierId]
  )

  // Load form options
  useEffect(() => {
    loadFormOptions()
  }, [])

  // Set form data when editing
  useEffect(() => {
    if (isEditing && existingSupplier) {
      setFormData({
        name: existingSupplier.name,
        supplierType: existingSupplier.supplierType,
        description: existingSupplier.description || "",
        contactPerson: existingSupplier.contactPerson,
        email: existingSupplier.email,
        phone: existingSupplier.phone,
        alternativePhone: existingSupplier.alternativePhone || "",
        website: existingSupplier.website || "",
        address: existingSupplier.address,
        city: existingSupplier.city,
        state: existingSupplier.state || "",
        country: existingSupplier.country,
        postalCode: existingSupplier.postalCode || "",
        taxId: existingSupplier.taxId || "",
        bankAccount: existingSupplier.bankAccount || "",
        paymentTerms: existingSupplier.paymentTerms,
        creditLimit: existingSupplier.creditLimit || 0,
        currency: existingSupplier.currency,
        isPreferred: existingSupplier.isPreferred,
        notes: existingSupplier.notes || "",
        tags: existingSupplier.tags || []
      })
    }
  }, [isEditing, existingSupplier])

  const loadFormOptions = async () => {
    setLoadingOptions(true)
    try {
      const supplierTypesData = await supplierService.getSupplierTypes()
      setSupplierTypes(supplierTypesData.filter(type => type && type.trim() !== ''))
    } catch (error) {
      console.error('Error loading form options:', error)
      setSupplierTypes([])
    } finally {
      setLoadingOptions(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEditing && supplierId) {
        const updateData: UpdateSupplierDto = formData
        await supplierService.updateSupplier(supplierId, updateData)
      } else {
        await supplierService.createSupplier(formData)
      }
      router.push(`/${tenant}/suppliers`)
    } catch (error) {
      console.error('Error saving supplier:', error)
      alert('Error al guardar el proveedor. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingSupplier) return <Loading message="Cargando proveedor..." />

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => router.push(`/${tenant}/suppliers`)} variant="outline" className="mt-2">
          Volver a Proveedores
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
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nombre de la Empresa *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Hotels Caribe Premium"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Proveedor *</label>
                {loadingOptions ? (
                  <Input placeholder="Cargando tipos..." disabled />
                ) : (
                  <Select
                    value={formData.supplierType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, supplierType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {supplierTypes.map(type => (
                        <SelectItem key={type} value={type}>{getSupplierTypeText(type)}</SelectItem>
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
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
                placeholder="Descripción del proveedor y sus servicios..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Persona de Contacto *</label>
                <Input
                  value={formData.contactPerson}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  placeholder="Nombre del contacto principal"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Sitio Web</label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://www.empresa.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email Principal *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contacto@proveedor.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Teléfono Principal *</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+57 5 123 4567"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Teléfono Alternativo</label>
              <Input
                value={formData.alternativePhone}
                onChange={(e) => setFormData(prev => ({ ...prev, alternativePhone: e.target.value }))}
                placeholder="+57 300 123 4567"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Dirección *</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Calle 10 #15-20"
                required
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Ciudad *</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Cartagena"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Estado/Departamento</label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Bolívar"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">País *</label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Código Postal</label>
                <Input
                  value={formData.postalCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                  placeholder="130001"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Financiera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">NIT/RUT</label>
                <Input
                  value={formData.taxId}
                  onChange={(e) => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
                  placeholder="123456789-0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Cuenta Bancaria</label>
                <Input
                  value={formData.bankAccount}
                  onChange={(e) => setFormData(prev => ({ ...prev, bankAccount: e.target.value }))}
                  placeholder="Número de cuenta"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Términos de Pago</label>
                <Select
                  value={formData.paymentTerms}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, paymentTerms: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PaymentTerms.Immediate}>Inmediato</SelectItem>
                    <SelectItem value={PaymentTerms.Net15}>Net 15</SelectItem>
                    <SelectItem value={PaymentTerms.Net30}>Net 30</SelectItem>
                    <SelectItem value={PaymentTerms.Net60}>Net 60</SelectItem>
                    <SelectItem value={PaymentTerms.Net90}>Net 90</SelectItem>
                    <SelectItem value={PaymentTerms.Custom}>Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Límite de Crédito</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, creditLimit: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="0"
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
                    <SelectItem value="COP">COP - Pesos Colombianos</SelectItem>
                    <SelectItem value="USD">USD - Dólares</SelectItem>
                    <SelectItem value="EUR">EUR - Euros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPreferred"
                checked={formData.isPreferred}
                onChange={(e) => setFormData(prev => ({ ...prev, isPreferred: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="isPreferred" className="text-sm font-medium">
                Marcar como proveedor preferido
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px] resize-none"
              placeholder="Notas adicionales sobre el proveedor..."
            />
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
                {isEditing ? "Actualizar Proveedor" : "Crear Proveedor"}
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/${tenant}/suppliers`)}
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