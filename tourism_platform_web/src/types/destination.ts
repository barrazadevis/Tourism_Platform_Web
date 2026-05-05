export interface Destination {
  id: string
  country: string
  city: string
  description?: string
  countryCode?: string
  region?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface DestinationResponseDto {
  id: string
  country: string
  city: string
  description?: string
  countryCode?: string
  region?: string
  isActive: boolean
}

export interface CreateDestinationDto {
  country: string
  city: string
  description?: string
  countryCode?: string
  region?: string
}

export interface UpdateDestinationDto {
  country: string
  city: string
  description?: string
  countryCode?: string
  region?: string
}

export interface DestinationSearchParams {
  page?: number
  pageSize?: number
  query?: string
  country?: string
  isActive?: boolean
}