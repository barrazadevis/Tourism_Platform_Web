import { api } from '@/lib/api'
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from '@/types/company'

export const companyService = {
  async getAllCompanies(): Promise<Company[]> {
    return api.get<Company[]>('/company')
  },

  async getCompanyById(id: string): Promise<Company> {
    return api.get<Company>(`/company/${id}`)
  },

  async createCompany(data: CreateCompanyRequest): Promise<Company> {
    return api.post<Company>('/company', data)
  },

  async updateCompany(id: string, data: UpdateCompanyRequest): Promise<Company> {
    return api.put<Company>(`/company/${id}`, data)
  },

  async deleteCompany(id: string): Promise<void> {
    return api.delete<void>(`/company/${id}`)
  },

  async deactivateCompany(id: string): Promise<void> {
    return api.patch<void>(`/company/${id}/deactivate`, {})
  },

  async activateCompany(id: string): Promise<void> {
    return api.patch<void>(`/company/${id}/activate`, {})
  }
}
