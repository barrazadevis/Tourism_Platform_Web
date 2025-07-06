import { api } from "@/lib/api"
import { 
    Payment,
    PaymentResponseDto, 
    PaymentSearchParams, 
    CreatePaymentDto,
    UpdatePaymentStatusDto,
    PaymentSummaryDto
  } from "@/types/payment"

export const paymentService = {
  async getPayments(params?: PaymentSearchParams): Promise<PaymentResponseDto[]> {
    const searchParams = {
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      ...params
    }
    return api.get<PaymentResponseDto[]>('/payments', searchParams)
  },

  async getPaymentById(id: string): Promise<PaymentResponseDto> {
    return api.get<PaymentResponseDto>(`/payments/${id}`)
  },

  async getPaymentsByBooking(bookingId: string): Promise<PaymentResponseDto[]> {
    return api.get<PaymentResponseDto[]>(`/payments/booking/${bookingId}`)
  },

  async getPaymentSummary(bookingId: string): Promise<PaymentSummaryDto> {
    return api.get<PaymentSummaryDto>(`/payments/booking/${bookingId}/summary`)
  },

  async createPayment(data: CreatePaymentDto): Promise<PaymentResponseDto> {
    return api.post<PaymentResponseDto>('/payments', data)
  },

  async updatePaymentStatus(id: string, data: UpdatePaymentStatusDto): Promise<PaymentResponseDto> {
    return api.patch<PaymentResponseDto>(`/payments/${id}/status`, data)
  },

  async generatePaymentNumber(): Promise<{ paymentNumber: string }> {
    return api.get<{ paymentNumber: string }>('/payments/generate-number')
  }
}