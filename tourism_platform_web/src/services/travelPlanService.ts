import { api } from "@/lib/api"
import { 
    TravelPlan,
    TravelPlanResponseDto, 
    TravelPlanSearchParams, 
    CreateTravelPlanDto,
    UpdateTravelPlanDto
  } from "@/types/travel-plan"

export const travelPlanService = {
  async getTravelPlans(params?: TravelPlanSearchParams): Promise<TravelPlanResponseDto[]> {
    const searchParams = {
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      ...params
    }
    return api.get<TravelPlanResponseDto[]>('/travelplans', searchParams)
  },

  async getTravelPlanById(id: string): Promise<TravelPlanResponseDto> {
    return api.get<TravelPlanResponseDto>(`/travelplans/${id}`)
  },

  async createTravelPlan(data: CreateTravelPlanDto): Promise<TravelPlanResponseDto> {
    return api.post<TravelPlanResponseDto>('/travelplans', data)
  },

  async updateTravelPlan(id: string, data: UpdateTravelPlanDto): Promise<TravelPlanResponseDto> {
    return api.put<TravelPlanResponseDto>(`/travelplans/${id}`, data)
  },

  async deleteTravelPlan(id: string): Promise<void> {
    return api.delete<void>(`/travelplans/${id}`)
  },

  async toggleTravelPlanStatus(id: string): Promise<void> {
    return api.patch<void>(`/travelplans/${id}/toggle-status`)
  },

  async getDestinations(): Promise<string[]> {
    return api.get<string[]>('/travelplans/destination')
  },

  async getPlanTypes(): Promise<string[]> {
    return api.get<string[]>('/travelplans/plan-types')
  }
}