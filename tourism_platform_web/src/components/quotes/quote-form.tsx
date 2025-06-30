'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface QuoteHotel {
  id: string
  hotelName: string
  roomType: string
  planType: string
  nights: number
  roomPrice: number
  taxesPrice: number
  checkInDate: string
  checkOutDate: string
}

interface QuoteFormData {
  customerId: string
  customerName: string
  departureDate: string
  returnDate: string
  numberOfAdults: number
  numberOfChildren: number
  numberOfInfants: number
  currency: string
  notes: string
  items: QuoteItem[]
  hotels: QuoteHotel[]
}

interface QuoteFormProps {
  tenant: string
  isEditing?: boolean
}

export function QuoteForm({ tenant, isEditing = false }: QuoteFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<QuoteFormData>({
    customerId: "",
    customerName: "",
    departureDate: "",
    returnDate: "",
    numberOfAdults: 2,
    numberOfChildren: 0,
    numberOfInfants: 0,
    currency: "COP",
    notes: "",
    items: [],
    hotels: []
  })

  const [isLoading, setIsLoading] = useState(false)

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    }
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
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
    return itemsTotal + hotelsTotal
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Saving quote:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push(`/${tenant}/quotes`)
    } catch (error) {
      console.error('Error saving quote:', error)
    } finally {
      setIsLoading(false)
    }
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
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.customerId}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, 
                    customerId: e.target.value,
                    customerName: e.target.options[e.target.selectedIndex].text
                  }))}
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  <option value="1">María González</option>
                  <option value="2">Carlos Ruiz</option>
                  <option value="3">Ana Martínez</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Moneda</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
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
                  value={formData.departureDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Fecha de Regreso *</label>
                <Input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
                  required
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
                />
              </div>
              <div>
                <label className="text-sm font-medium">Niños</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.numberOfChildren}
                  onChange={(e) => setFormData(prev => ({ ...prev, numberOfChildren: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Infantes</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.numberOfInfants}
                  onChange={(e) => setFormData(prev => ({ ...prev, numberOfInfants: parseInt(e.target.value) || 0 }))}
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
              <Button type="button" onClick={addItem} size="sm">
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
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cantidad</label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Precio Unit.</label>
                      <Input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
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
              <Button type="button" onClick={addHotel} size="sm">
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
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tipo de Habitación</label>
                        <Input
                          value={hotel.roomType}
                          onChange={(e) => updateHotel(hotel.id, 'roomType', e.target.value)}
                          placeholder="Ej: Doble"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Plan</label>
                        <Input
                          value={hotel.planType}
                          onChange={(e) => updateHotel(hotel.id, 'planType', e.target.value)}
                          placeholder="Ej: Todo Incluido"
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
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Check-out</label>
                        <Input
                          type="date"
                          value={hotel.checkOutDate}
                          onChange={(e) => updateHotel(hotel.id, 'checkOutDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Noches</label>
                        <Input
                          type="number"
                          min="1"
                          value={hotel.nights}
                          onChange={(e) => updateHotel(hotel.id, 'nights', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Precio Habitación</label>
                        <Input
                          type="number"
                          min="0"
                          value={hotel.roomPrice}
                          onChange={(e) => updateHotel(hotel.id, 'roomPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Impuestos</label>
                        <Input
                          type="number"
                          min="0"
                          value={hotel.taxesPrice}
                          onChange={(e) => updateHotel(hotel.id, 'taxesPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear Cotización"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/${tenant}/quotes`)}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}