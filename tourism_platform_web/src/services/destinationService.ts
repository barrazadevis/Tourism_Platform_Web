import { api } from "@/lib/api"
import { 
  Destination,
  DestinationResponseDto, 
  DestinationSearchParams, 
  CreateDestinationDto,
  UpdateDestinationDto
} from "@/types/destination"

export const destinationService = {
  async getDestinations(params?: DestinationSearchParams): Promise<DestinationResponseDto[]> {
    const searchParams = {
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      ...params
    }
    return api.get<DestinationResponseDto[]>('/destination', searchParams)
  },

  async getDestinationById(id: string): Promise<DestinationResponseDto> {
    return api.get<DestinationResponseDto>(`/destination/${id}`)
  },

  async createDestination(data: CreateDestinationDto): Promise<DestinationResponseDto> {
    return api.post<DestinationResponseDto>('/destination', data)
  },

  async updateDestination(id: string, data: UpdateDestinationDto): Promise<DestinationResponseDto> {
    return api.put<DestinationResponseDto>(`/destination/${id}`, data)
  },

  async deleteDestination(id: string): Promise<void> {
    return api.delete<void>(`/destination/${id}`)
  },

  async searchDestinations(query: string): Promise<DestinationResponseDto[]> {
    return api.get<DestinationResponseDto[]>('/destination/search', { query })
  },

  async getCountries(): Promise<string[]> {
    const destinations = await this.getDestinations({ pageSize: 1000 })
    const countries = [...new Set(destinations.map(d => d.country))].sort()
    return countries
  },

  async getCitiesByCountry(country: string): Promise<string[]> {
    const destinations = await this.getDestinations({ pageSize: 1000, country })
    const cities = destinations
      .filter(d => d.country === country)
      .map(d => d.city)
      .sort()
    return cities
  },

  async getRegions(): Promise<string[]> {
    const destinations = await this.getDestinations({ pageSize: 1000 })
    const regions = [...new Set(destinations
      .map(d => d.region)
      .filter(r => r && r.trim() !== ''))] as string[]
    return regions.sort()
  },

  async getDestinationsByRegion(region: string): Promise<DestinationResponseDto[]> {
    const destinations = await this.getDestinations({ pageSize: 1000 })
    return destinations.filter(d => d.region === region)
  },

  async getPopularDestinations(limit: number = 10): Promise<DestinationResponseDto[]> {
    // Por ahora retorna los primeros, pero se puede implementar lógica de popularidad
    const destinations = await this.getDestinations({ pageSize: limit })
    return destinations.slice(0, limit)
  },

  async validateDestinationExists(country: string, city: string): Promise<boolean> {
    try {
      const destinations = await this.searchDestinations(`${country} ${city}`)
      return destinations.some(d => 
        d.country.toLowerCase() === country.toLowerCase() && 
        d.city.toLowerCase() === city.toLowerCase()
      )
    } catch {
      return false
    }
  }
}