'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, User, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { bookingService } from "@/services/bookingService"
import { quoteService } from "@/services/quotes" // Assuming you have this
import { ApiError } from "@/lib/api"
import { CreateBookingDto, Passenger } from "@/types/booking"

interface QuoteData {
  id: string
  quoteNumber: string
  customerName: string
  destination: string
  departureDate: string
  returnDate: string
  totalAmount: number
  numberOfAdults: number
  numberOfChildren: number
  numberOfInfants: number
}

interface NewBookingFormProps {
  tenant: string
  quoteId?: string
}

export function NewBookingForm({ tenant, quoteId }: NewBookingFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [specialRequests, setSpecialRequests] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingQuote, setLoadingQuote] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load quote data when component mounts
  useEffect(() => {
    const loadQuote = async () => {
      if (!quoteId) {
        setError("ID de cotización no válido")
        setLoadingQuote(false)
        return
      }

      try {
        setLoadingQuote(true)
        setError(null)
        
        // Use your existing quote service
        const quoteResponse = await quoteService.getQuoteById(quoteId)
        // Map QuoteResponse to QuoteData
        const quoteData: QuoteData = {
          id: quoteResponse.id,
          quoteNumber: quoteResponse.quoteNumber,
          customerName: quoteResponse.customerName,
          destination: quoteResponse.destination, // Ensure this exists in QuoteResponse
          departureDate: quoteResponse.departureDate,
          returnDate: quoteResponse.returnDate,
          totalAmount: quoteResponse.totalAmount,
          numberOfAdults: quoteResponse.numberOfAdults,
          numberOfChildren: quoteResponse.numberOfChildren,
          numberOfInfants: quoteResponse.numberOfInfants
        }
        setQuote(quoteData)
        
        // Initialize passengers based on quote
        const totalPassengers = quoteData.numberOfAdults + quoteData.numberOfChildren + quoteData.numberOfInfants
        const initialPassengers: Passenger[] = []
        
        for (let i = 0; i < totalPassengers; i++) {
          initialPassengers.push({
            id: (i + 1).toString(),
            firstName: "",
            lastName: "",
            documentType: "CC",
            documentNumber: "",
            dateOfBirth: "",
            gender: "",
            nationality: "Colombiana",
            isMainPassenger: i === 0
          })
        }
        
        setPassengers(initialPassengers)
      } catch (error) {
        console.error('Error loading quote:', error)
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : "Error al cargar la cotización"
        setError(errorMessage)
      } finally {
        setLoadingQuote(false)
      }
    }

    loadQuote()
  }, [quoteId])

  const updatePassenger = (id: string, field: keyof Passenger, value: string | boolean) => {
    setPassengers(prev => prev.map(passenger => 
      passenger.id === id ? { ...passenger, [field]: value } : passenger
    ))
  }

  const addPassenger = () => {
    const newPassenger: Passenger = {
      id: Date.now().toString(),
      firstName: "",
      lastName: "",
      documentType: "CC",
      documentNumber: "",
      dateOfBirth: "",
      gender: "",
      nationality: "Colombiana",
      isMainPassenger: false
    }
    setPassengers(prev => [...prev, newPassenger])
  }

  const removePassenger = (id: string) => {
    setPassengers(prev => prev.filter(p => p.id !== id))
  }

  const validateForm = (): boolean => {
    if (passengers.length === 0) {
      setError("Debe agregar al menos un pasajero")
      return false
    }

    const mainPassengerCount = passengers.filter(p => p.isMainPassenger).length
    if (mainPassengerCount !== 1) {
      setError("Debe haber exactamente un pasajero principal")
      return false
    }

    for (const passenger of passengers) {
      if (!passenger.firstName.trim() || !passenger.lastName.trim() || 
          !passenger.documentNumber.trim() || !passenger.dateOfBirth || 
          !passenger.gender) {
        setError("Todos los campos obligatorios deben ser completados")
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    if (!quoteId) {
      setError("ID de cotización no válido")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Prepare booking data according to your CreateBookingDto interface
      const bookingData: CreateBookingDto = {
        quoteId,
        passengers: passengers.map(p => ({
          firstName: p.firstName.trim(),
          lastName: p.lastName.trim(),
          documentType: p.documentType,
          documentNumber: p.documentNumber.trim(),
          dateOfBirth: p.dateOfBirth,
          gender: p.gender,
          nationality: p.nationality.trim(),
          isMainPassenger: p.isMainPassenger
        })),
        specialRequests: specialRequests.trim() || undefined
      }
      
      // Use your existing booking service
      const result = await bookingService.createBookingFromQuote(bookingData)
      
      // Redirect to the newly created booking or bookings list
      router.push(`/${tenant}/bookings/${result.id}`)
    } catch (error) {
      console.error('Error creating booking:', error)
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : "Error al crear la reserva"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (loadingQuote) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href={`/${tenant}/quotes`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Reserva</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p>Cargando cotización...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state or quote not found
  if (error || !quote) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href={`/${tenant}/quotes`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Reserva</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">{error || "No se encontró la cotización especificada."}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/${tenant}/quotes/${quoteId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Cotización
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Reserva</h1>
          <p className="text-gray-600">Crear reserva desde cotización {quote.quoteNumber}</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Quote Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Resumen de la Cotización
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Cliente</p>
              <p className="font-medium">{quote.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Destino</p>
              <p className="font-medium">{quote.destination}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fechas</p>
              <p className="font-medium text-sm">
                {formatDate(quote.departureDate)} - {formatDate(quote.returnDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-bold text-primary">{formatCurrency(quote.totalAmount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Passengers */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Información de Pasajeros
              </CardTitle>
              <Button type="button" onClick={addPassenger} size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Pasajero
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Complete la información de todos los pasajeros
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {passengers.map((passenger, index) => (
              <div key={passenger.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium flex items-center">
                    Pasajero {index + 1}
                    {passenger.isMainPassenger && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Principal
                      </span>
                    )}
                  </h4>
                  {!passenger.isMainPassenger && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePassenger(passenger.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombres *</label>
                    <Input
                      value={passenger.firstName}
                      onChange={(e) => updatePassenger(passenger.id!, 'firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Apellidos *</label>
                    <Input
                      value={passenger.lastName}
                      onChange={(e) => updatePassenger(passenger.id!, 'lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tipo de Documento *</label>
                    <select
                      value={passenger.documentType}
                      onChange={(e) => updatePassenger(passenger.id!, 'documentType', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
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
                      value={passenger.documentNumber}
                      onChange={(e) => updatePassenger(passenger.id!, 'documentNumber', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Fecha de Nacimiento *</label>
                    <Input
                      type="date"
                      value={passenger.dateOfBirth}
                      onChange={(e) => updatePassenger(passenger.id!, 'dateOfBirth', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Género *</label>
                    <select
                      value={passenger.gender}
                      onChange={(e) => updatePassenger(passenger.id!, 'gender', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Seleccionar</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nacionalidad</label>
                    <Input
                      value={passenger.nationality}
                      onChange={(e) => updatePassenger(passenger.id!, 'nationality', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Special Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Especiales</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px] resize-none"
              placeholder="Dietas especiales, asistencia médica, preferencias de habitación, etc."
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creando Reserva..." : "Crear Reserva"}
          </Button>
          <Link href={`/${tenant}/quotes/${quoteId}`}>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}