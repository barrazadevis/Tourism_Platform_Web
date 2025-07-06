import { api } from '@/lib/api'

export interface CreateCustomerRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  documentType: string
  documentNumber: string
  address: string
  city: string
  country: string
  dateOfBirth?: string
  preferredLanguage: string
  notes: string
}

export interface UpdateCustomerRequest extends CreateCustomerRequest {}

export interface CustomerResponse {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  documentType: string
  documentNumber: string
  address: string
  city: string
  country: string
  dateOfBirth?: string
  age?: number
  preferredLanguage: string
  notes: string
  createdAt: string
  updatedAt?: string
  totalQuotes: number
  totalBookings: number
  totalSpent: number
}

export interface CustomerSearchParams {
  searchTerm?: string
  documentNumber?: string
  email?: string
  phone?: string
  page?: number
  pageSize?: number
}

export const customerService = {
  async getCustomers(params?: CustomerSearchParams): Promise<CustomerResponse[]> {
    return api.get<CustomerResponse[]>('/customers', params)
  },

  async getCustomerById(id: string): Promise<CustomerResponse> {
    return api.get<CustomerResponse>(`/customers/${id}`)
  },

  async createCustomer(data: CreateCustomerRequest): Promise<CustomerResponse> {
    return api.post<CustomerResponse>('/customers', data)
  },

  async updateCustomer(id: string, data: UpdateCustomerRequest): Promise<CustomerResponse> {
    return api.put<CustomerResponse>(`/customers/${id}`, data)
  },

  async deleteCustomer(id: string): Promise<void> {
    return api.delete<void>(`/customers/${id}`)
  },

  async checkExists(email: string, documentNumber: string, excludeId?: string): Promise<{ exists: boolean }> {
    const params = { email, documentNumber, ...(excludeId && { excludeId }) }
    return api.get<{ exists: boolean }>('/customers/exists', params)
  }
}