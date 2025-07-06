import { api } from "@/lib/api"
import { 
    Booking,
    BookingResponseDto, 
    BookingSearchParams, 
    CancelBookingRequest, 
    CreateBookingDto,
    UpdateBookingStatusDto,
    UpdateBookingStatusRequest
  } from "@/types/booking"

export const bookingService = {
  async getBookings(params?: BookingSearchParams): Promise<Booking[]> {
    return api.get<Booking[]>('/bookings', params)
  },

  async getBookingById(id: string): Promise<BookingResponseDto> {
    return api.get<BookingResponseDto>(`/bookings/${id}`)
  },

  async getBookingsByCustomer(customerId: string): Promise<BookingResponseDto[]> {
    return api.get<BookingResponseDto[]>(`/bookings/customer/${customerId}`)
  },

  async createBookingFromQuote(data: CreateBookingDto): Promise<BookingResponseDto> {
    return api.post<BookingResponseDto>('/bookings/from-quote', data)
  },

  async updateBookingStatus(id: string, data: UpdateBookingStatusDto): Promise<BookingResponseDto> {
    return api.patch<BookingResponseDto>(`/bookings/${id}/status`, data)
  },

  async cancelBooking(id: string, request: CancelBookingRequest): Promise<void> {
    return api.post<void>(`/bookings/${id}/cancel`, request)
  },

  async generateBookingNumber(): Promise<{ bookingNumber: string }> {
    return api.get<{ bookingNumber: string }>('/bookings/generate-number')
  }
}
