'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/shared/loading"
import { formatCurrency } from "@/lib/utils"
import { useApi } from "@/hooks/use-api"
import { customerService, CustomerResponse } from "@/services/customers"
import { quoteService, CreateQuoteRequest } from "@/services/quotes"
import { ApiError } from "@/lib/api"

interface QuoteItem {
  id: string
  itemType: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  isOptional: boolean
  serviceDate: string
  notes: string
}

interface QuoteHotel {
  id: string
  hotelName: string
  hotelCategory: string
  roomType: string
  planType: string
  nights: number
  roomPrice: number
  taxesPrice: number
  checkInDate: string
  checkOutDate: string
}

interface QuoteFormData {
  id: string
  customerId: string
  customerName: string
  travelPlanId: string
  departureDate: string
  returnDate: string
  numberOfAdults: number
  numberOfChildren: number
  numberOfInfants: number
  currency: string
  taxAmount: number
  discountAmount: number
  validityDays: number
  notes: string
  items: QuoteItem[]
  hotels: QuoteHotel[]
}

interface QuoteFormProps {
  isEditing?: boolean
  quoteId?: string
}

export function QuoteForm({ isEditing = false, quoteId }: QuoteFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<QuoteFormData>({
    id: "",
    customerId: "",
    customerName: "",
    travelPlanId: "",
    departureDate: "",
    returnDate: "",
    numberOfAdults: 2,
    numberOfChildren: 0,
    numberOfInfants: 0,
    currency: "COP",
    taxAmount: 0,
    discountAmount: 0,
    validityDays: 30,
    notes: "",
    items: [],
    hotels: []
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(isEditing)

  // Load customers from API
  const { data: customers, loading: customersLoading } = useApi<CustomerResponse[]>(
    () => customerService.getCustomers({ pageSize: 100 }),
    []
  )

  useEffect(() => {
    if (isEditing && quoteId) {
      loadQuote()
    }
  }, [isEditing, quoteId])

  const loadQuote = async () => {
    try {
      const quote = await quoteService.getQuoteById(quoteId!)
      
      setFormData({
        id: quote.id,
        customerId: quote.customerId, // Assuming customer ID is available
        customerName: quote.customerName,
        travelPlanId: quote.travelPlanName || "",
        departureDate: quote.departureDate,
        returnDate: quote.returnDate,
        numberOfAdults: quote.numberOfAdults,
        numberOfChildren: quote.numberOfChildren,
        numberOfInfants: quote.numberOfInfants,
        currency: quote.currency,
        taxAmount: quote.taxAmount,
        discountAmount: quote.discountAmount,
        validityDays: 30, // Default value
        notes: quote.notes,
        items: quote.items.map(item => ({
          id: Date.now().toString() + Math.random(),
          itemType: item.itemType,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          isOptional: item.isOptional,
          serviceDate: item.serviceDate || "",
          notes: item.notes
        })),
        hotels: quote.hotels.map(hotel => ({
          id: Date.now().toString() + Math.random(),
          hotelName: hotel.hotelName,
          hotelCategory: hotel.hotelCategory,
          roomType: hotel.roomType,
          planType: hotel.planType,
          nights: hotel.nights,
          roomPrice: hotel.roomPrice,
          taxesPrice: hotel.taxesPrice,
          checkInDate: hotel.checkInDate,
          checkOutDate: hotel.checkOutDate
        }))
      })
    } catch (error) {
      setError('Error al cargar la cotización')
      console.error('Error loading quote:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      itemType: "Transporte",
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      isOptional: false,
      serviceDate: "",
      notes: ""
    }
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === 'quantity' || field === 'unitPrice') {
            updated.totalPrice = Number(updated.quantity) * Number(updated.unitPrice)
          }
          return updated
        }
        return item
      })
    }))
  }

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  const addHotel = () => {
    const newHotel: QuoteHotel = {
      id: Date.now().toString(),
      hotelName: "",
      hotelCategory: "",
      roomType: "",
      planType: "",
      nights: 1,
      roomPrice: 0,
      taxesPrice: 0,
      checkInDate: "",
      checkOutDate: ""
    }
    setFormData(prev => ({
      ...prev,
      hotels: [...prev.hotels, newHotel]
    }))
  }

  const updateHotel = (id: string, field: keyof QuoteHotel, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      hotels: prev.hotels.map(hotel => 
        hotel.id === id ? { ...hotel, [field]: value } : hotel
      )
    }))
  }

  const removeHotel = (id: string) => {
    setFormData(prev => ({
      ...prev,
      hotels: prev.hotels.filter(hotel => hotel.id !== id)
    }))
  }

  const calculateTotal = () => {
    const itemsTotal = formData.items.reduce((sum, item) => sum + item.totalPrice, 0)
    const hotelsTotal = formData.hotels.reduce((sum, hotel) => 
      sum + hotel.roomPrice + hotel.taxesPrice, 0
    )
    const subTotal = itemsTotal + hotelsTotal
    return subTotal + formData.taxAmount - formData.discountAmount
  }

  const handleCustomerChange = (customerId: string) => {
    const selectedCustomer = customers?.find(c => c.id === customerId)
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : ""
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const quoteData: CreateQuoteRequest = {
        customerId: formData.customerId,
        travelPlanId: formData.travelPlanId || undefined,
        departureDate: formData.departureDate,
        returnDate: formData.returnDate,
        numberOfAdults: formData.numberOfAdults,
        numberOfChildren: formData.numberOfChildren,
        numberOfInfants: formData.numberOfInfants,
        taxAmount: formData.taxAmount,
        discountAmount: formData.discountAmount,
        currency: formData.currency,
        validityDays: formData.validityDays,
        notes: formData.notes,
        items: formData.items.map(item => ({
          itemType: item.itemType,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          isOptional: item.isOptional,
          serviceDate: item.serviceDate || undefined,
          notes: item.notes
        })),
        hotels: formData.hotels.map(hotel => ({
          hotelName: hotel.hotelName,
          hotelCategory: hotel.hotelCategory,
          roomType: hotel.roomType,
          planType: hotel.planType,
          nights: hotel.nights,
          roomPrice: hotel.roomPrice,
          taxesPrice: hotel.taxesPrice,
          checkInDate: hotel.checkInDate,
          checkOutDate: hotel.checkOutDate
        }))
      }

      if (isEditing && quoteId) {
        await quoteService.updateQuote(quoteId, quoteData)
      } else {
        await quoteService.createQuote(quoteData)
      }
      
      router.push(`/quotes`)
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Error al guardar la cotización'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return ""
    return new Date(isoDate).toISOString().split('T')[0];
  };

  if (initialLoading) {
    return <Loading message="Cargando información de la cotización..." />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? "Editar Cotización" : "Nueva Cotización"}
        </h1>
        <p className="text-gray-600">
          Crea una cotización detallada para tu cliente
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Cliente *</label>
                {customersLoading ? (
                  <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm items-center">
                    <span className="text-gray-500">Cargando clientes...</span>
                  </div>
                ) : (
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.customerId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Seleccionar cliente</option>
                    {customers?.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Moneda</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  disabled={isLoading}
                >
                  <option value="COP">Pesos Colombianos (COP)</option>
                  <option value="USD">Dólares (USD)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Travel Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5" />
              Fechas de Viaje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Fecha de Salida *</label>
                <Input
                  type="date"
                  value={formatDateForInput(formData.departureDate)}
                  onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Fecha de Regreso *</label>
                <Input
                  type="date"
                  value={formatDateForInput(formData.returnDate)}
                  onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Adultos *</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.numberOfAdults}
                  onChange={(e) => setFormData(prev => ({ ...prev, numberOfAdults: parseInt(e.target.value) || 0 }))}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Niños</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.numberOfChildren}
                  onChange={(e) => setFormData(prev => ({ ...prev, numberOfChildren: parseInt(e.target.value) || 0 }))}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Infantes</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.numberOfInfants}
                  onChange={(e) => setFormData(prev => ({ ...prev, numberOfInfants: parseInt(e.target.value) || 0 }))}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Items de la Cotización</CardTitle>
              <Button type="button" onClick={addItem} size="sm" disabled={isLoading}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {formData.items.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay items agregados. Haz clic en "Agregar Item" para comenzar.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-6 gap-4 items-end">
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Descripción</label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Ej: Tiquetes aéreos"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cantidad</label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Precio Unit.</label>
                      <Input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Total</label>
                      <Input
                        value={formatCurrency(item.totalPrice)}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hotels */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Hoteles</CardTitle>
              <Button type="button" onClick={addHotel} size="sm" disabled={isLoading}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Hotel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {formData.hotels.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay hoteles agregados.
              </p>
            ) : (
              <div className="space-y-6">
                {formData.hotels.map((hotel) => (
                  <div key={hotel.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Hotel #{hotel.id}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeHotel(hotel.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Nombre del Hotel</label>
                        <Input
                          value={hotel.hotelName}
                          onChange={(e) => updateHotel(hotel.id, 'hotelName', e.target.value)}
                          placeholder="Ej: Hotel Caribe"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tipo de Habitación</label>
                        <Input
                          value={hotel.roomType}
                          onChange={(e) => updateHotel(hotel.id, 'roomType', e.target.value)}
                          placeholder="Ej: Doble"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Plan</label>
                        <Input
                          value={hotel.planType}
                          onChange={(e) => updateHotel(hotel.id, 'planType', e.target.value)}
                          placeholder="Ej: Todo Incluido"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <label className="text-sm font-medium">Check-in</label>
                        <Input
                          type="date"
                          value={hotel.checkInDate}
                          onChange={(e) => updateHotel(hotel.id, 'checkInDate', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Check-out</label>
                        <Input
                          type="date"
                          value={hotel.checkOutDate}
                          onChange={(e) => updateHotel(hotel.id, 'checkOutDate', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Noches</label>
                        <Input
                          type="number"
                          min="1"
                          value={hotel.nights}
                          onChange={(e) => updateHotel(hotel.id, 'nights', parseInt(e.target.value) || 0)}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Precio Habitación</label>
                        <Input
                          type="number"
                          min="0"
                          value={hotel.roomPrice}
                          onChange={(e) => updateHotel(hotel.id, 'roomPrice', parseFloat(e.target.value) || 0)}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Impuestos</label>
                        <Input
                          type="number"
                          min="0"
                          value={hotel.taxesPrice}
                          onChange={(e) => updateHotel(hotel.id, 'taxesPrice', parseFloat(e.target.value) || 0)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Costs */}
        <Card>
          <CardHeader>
            <CardTitle>Costos Adicionales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Impuestos</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.taxAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, taxAmount: parseFloat(e.target.value) || 0 }))}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descuento</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }))}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-medium">Total Cotización:</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(calculateTotal())}
              </span>
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
              placeholder="Notas o condiciones especiales..."
              disabled={isLoading}
            />
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-4">
          <Button type="submit" disabled={isLoading || customersLoading}>
            {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear Cotización"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/quotes`)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}