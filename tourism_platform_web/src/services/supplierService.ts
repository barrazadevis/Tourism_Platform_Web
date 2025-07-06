import { api } from "@/lib/api"
import { 
    Supplier,
    SupplierResponseDto, 
    SupplierSearchParams, 
    CreateSupplierDto,
    UpdateSupplierDto
  } from "@/types/supplier"

export const supplierService = {
  async getSuppliers(params?: SupplierSearchParams): Promise<SupplierResponseDto[]> {
    const searchParams = {
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      ...params
    }
    return api.get<SupplierResponseDto[]>('/suppliers', searchParams)
  },

  async getSupplierById(id: string): Promise<SupplierResponseDto> {
    return api.get<SupplierResponseDto>(`/suppliers/${id}`)
  },

  async createSupplier(data: CreateSupplierDto): Promise<SupplierResponseDto> {
    return api.post<SupplierResponseDto>('/suppliers', data)
  },

  async updateSupplier(id: string, data: UpdateSupplierDto): Promise<SupplierResponseDto> {
    return api.put<SupplierResponseDto>(`/suppliers/${id}`, data)
  },

  async deleteSupplier(id: string): Promise<void> {
    return api.delete<void>(`/suppliers/${id}`)
  },

  async toggleSupplierStatus(id: string): Promise<void> {
    return api.patch<void>(`/suppliers/${id}/toggle-status`)
  },

  async getSupplierTypes(): Promise<string[]> {
    return api.get<string[]>('/suppliers/types')
  }
}