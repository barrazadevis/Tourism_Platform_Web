// Travel Plan Types and Enums
export enum PlanType {
  Adventure = 'Adventure',
  Cultural = 'Cultural',
  Beach = 'Beach',
  Business = 'Business',
  Family = 'Family',
  Romantic = 'Romantic',
  Backpacking = 'Backpacking',
  Luxury = 'Luxury',
  EcoTourism = 'EcoTourism',
  Religious = 'Religious'
}

export enum DifficultyLevel {
  Easy = 'Easy',
  Moderate = 'Moderate',
  Challenging = 'Challenging',
  Expert = 'Expert'
}

// Base Travel Plan interface
export interface TravelPlan {
  id: string
  name: string
  description: string
  destination: string
  planType: string
  duration: number // days
  price: number
  currency: string
  maxGroupSize: number
  minAge: number
  maxAge?: number
  difficultyLevel: string
  includesAccommodation: boolean
  includesTransportation: boolean
  includesMeals: boolean
  includesGuide: boolean
  isActive: boolean
  imageUrl?: string
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary?: TravelPlanDay[]
  createdAt: string
  updatedAt: string
}

// Travel Plan Day for itinerary
export interface TravelPlanDay {
  day: number
  title: string
  description: string
  activities: string[]
  accommodation?: string
  meals: string[]
}

// Travel Plan Response DTO
export interface TravelPlanResponseDto extends TravelPlan {
  totalQuotes?: number
  totalBookings?: number
  averageRating?: number
  reviewCount?: number
}

// Create Travel Plan DTO
export interface CreateTravelPlanDto {
  name: string
  description: string
  destination: string
  planType: string
  duration: number
  price: number
  currency: string
  maxGroupSize: number
  minAge: number
  maxAge?: number
  difficultyLevel: string
  includesAccommodation: boolean
  includesTransportation: boolean
  includesMeals: boolean
  includesGuide: boolean
  imageUrl?: string
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary?: TravelPlanDay[]
}

// Update Travel Plan DTO
export interface UpdateTravelPlanDto {
  name?: string
  description?: string
  destination?: string
  planType?: string
  duration?: number
  price?: number
  currency?: string
  maxGroupSize?: number
  minAge?: number
  maxAge?: number
  difficultyLevel?: string
  includesAccommodation?: boolean
  includesTransportation?: boolean
  includesMeals?: boolean
  includesGuide?: boolean
  imageUrl?: string
  highlights?: string[]
  inclusions?: string[]
  exclusions?: string[]
  itinerary?: TravelPlanDay[]
}

// Travel Plan Search Parameters (matches controller parameters)
export interface TravelPlanSearchParams {
  searchTerm?: string
  destination?: string
  planType?: string
  minPrice?: number
  maxPrice?: number
  minDuration?: number
  maxDuration?: number
  isActive?: boolean
  page?: number
  pageSize?: number
  // Additional UI filters
  difficultyLevel?: string
  includesAccommodation?: boolean
  includesTransportation?: boolean
  includesMeals?: boolean
  includesGuide?: boolean
  minGroupSize?: number
  maxGroupSize?: number
  minAge?: number
  maxAge?: number
}

// Travel Plan Search DTO (for backend)
export interface TravelPlanSearchDto {
  searchTerm?: string
  destination?: string
  planType?: string
  minPrice?: number
  maxPrice?: number
  minDuration?: number
  maxDuration?: number
  isActive?: boolean
  page: number
  pageSize: number
}

// Travel Plan Statistics (for dashboard)
export interface TravelPlanStats {
  totalPlans: number
  activePlans: number
  inactivePlans: number
  averagePrice: number
  averageDuration: number
  popularDestinations: DestinationStat[]
  popularPlanTypes: PlanTypeStat[]
  recentPlans: TravelPlanResponseDto[]
}

export interface DestinationStat {
  destination: string
  count: number
  averagePrice: number
}

export interface PlanTypeStat {
  planType: string
  count: number
  averagePrice: number
}

// Travel Plan Filter Options (for UI components)
export interface TravelPlanFilterOptions {
  destinations: string[]
  planTypes: string[]
  difficultyLevels: string[]
  priceRange: {
    min: number
    max: number
  }
  durationRange: {
    min: number
    max: number
  }
}

// Travel Plan Bulk Operations
export interface BulkUpdateTravelPlansDto {
  ids: string[]
  updateData: Partial<UpdateTravelPlanDto>
}

export interface BulkToggleStatusDto {
  ids: string[]
  isActive: boolean
}