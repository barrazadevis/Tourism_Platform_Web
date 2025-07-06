import { api } from '@/lib/api'
import { UpdateQuoteStatusRequest } from '@/types/booking'

export interface CreateQuoteRequest {
  customerId: string
  travelPlanId?: string
  departureDate: string
  returnDate: string
  numberOfAdults: number
  numberOfChildren: number
  numberOfInfants: number
  taxAmount: number
  discountAmount: number
  currency: string
  validityDays: number
  notes: string
  items: Array<{
    itemType: string
    description: string
    quantity: number
    unitPrice: number
    isOptional: boolean
    serviceDate?: string
    notes: string
  }>
  hotels: Array<{
    hotelName: string
    hotelCategory: string
    roomType: string
    planType: string
    nights: number
    roomPrice: number
    taxesPrice: number
    checkInDate: string
    checkOutDate: string
  }>
}

export interface QuoteResponse {
  destination: string
  id: string
  customerId: string
  quoteNumber: string
  customerName: string
  customerEmail: string
  travelPlanName?: string
  departureDate: string
  returnDate: string
  totalPassengers: number
  numberOfAdults: number
  numberOfChildren: number
  numberOfInfants: number
  subTotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  pricePerPerson: number
  status: string
  currency: string
  validUntil: string
  notes: string
  createdAt: string
  items: Array<{
    id: string | null | undefined
    itemType: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
    isOptional: boolean
    serviceDate?: string
    notes: string
  }>
  hotels: Array<{
    id: string | null | undefined
    hotelName: string
    hotelCategory: string
    roomType: string
    planType: string
    nights: number
    roomPrice: number
    taxesPrice: number
    totalHotelPrice: number
    checkInDate: string
    checkOutDate: string
  }>
}

export const quoteService = {
  async getQuotes(page = 1, pageSize = 10): Promise<QuoteResponse[]> {
    return api.get<QuoteResponse[]>('/quotes', { page, pageSize })
  },

  async getQuoteById(id: string): Promise<QuoteResponse> {
    return api.get<QuoteResponse>(`/quotes/${id}`)
  },

  async createQuote(data: CreateQuoteRequest): Promise<QuoteResponse> {
    return api.post<QuoteResponse>('/quotes', data)
  },

  async updateQuote(id: string, data: CreateQuoteRequest): Promise<QuoteResponse> {
    return api.put<QuoteResponse>(`/quotes/${id}`, data)
  },

  async updateQuoteStatus(id: string, status: 'approved' | 'rejected', notes?: string): Promise<QuoteResponse> {
    // Convert string status to enum number
    const statusMap = {
      'approved': 3, // QuoteStatus.Approved
      'rejected': 4  // QuoteStatus.Rejected
    }
    
    const requestData: UpdateQuoteStatusRequest = {
      status: statusMap[status],
      notes: notes || ''
    }
    
    return api.patch<QuoteResponse>(`/quotes/${id}/status`, requestData)
  },

  async deleteQuote(id: string): Promise<void> {
    return api.delete<void>(`/quotes/${id}`)
  },

  async generateQuoteNumber(): Promise<{ quoteNumber: string }> {
    return api.get<{ quoteNumber: string }>('/quotes/generate-number')
  }
}