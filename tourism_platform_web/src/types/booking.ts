import { Payment } from "./payment"

export interface Booking {
  id: string
  bookingNumber: string
  quoteNumber: string
  customerName: string
  destination: string
  departureDate: string
  returnDate: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  totalAmount: number
  totalPaid: number
  pendingAmount: number
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded'
  passengersCount: number
  createdAt: string
}

export interface Passenger {
  id?: string
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  dateOfBirth: string
  gender: string
  nationality: string
  isMainPassenger: boolean
}

export interface CreateBookingDto {
  quoteId: string
  specialRequests?: string
  passengers?: Passenger[]
}

export interface UpdateQuoteStatusRequest {
  status: number
  notes?: string
}
export interface UpdateBookingStatusRequest {
  status: number
  notes?: string
}

export interface UpdateBookingStatusDto {
  status: BookingStatus
  notes?: string
}

export interface CancelBookingRequest {
  reason: string
}

export interface BookingResponseDto {
  id: string
  bookingNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  quoteId: string
  status: string
  totalAmount: number
  notes?: string
  createdAt: string
  updatedAt?: string
  cancelledAt?: string
  cancelReason?: string
  destination: string
  departureDate: string
  returnDate: string
  specialRequests?: string
  passengers: Passenger[]
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded'
  totalPaid: number
  payments: Payment[]
  customer: {
    id: string
    fullName: string
    email: string
    phone: string
  }
  quote: {
    id: string
    quoteNumber: string
    totalAmount: number
  }
}

export enum BookingStatus {
  PENDING = 1,
  CONFIRMED = 2,
  IN_PROGRESS = 3,
  COMPLETED = 4,
  CANCELLED = 5
}

export interface BookingSearchParams {
  page?: number
  pageSize?: number
  status?: BookingStatus
  customerId?: string
  dateFrom?: string
  dateTo?: string
}