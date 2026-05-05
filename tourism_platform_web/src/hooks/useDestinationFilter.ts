import { useApi } from '@/hooks/use-api'
import { destinationService } from '@/services/destinationService'

export function useDestinationFilters() {
  const { data: countries, loading: countriesLoading } = useApi(() => destinationService.getCountries(), [])
  const { data: regions, loading: regionsLoading } = useApi(() => destinationService.getRegions(), [])

  const getCitiesByCountry = async (country: string) => {
    return destinationService.getCitiesByCountry(country)
  }

  return {
    countries: countries || [],
    regions: regions || [],
    loading: countriesLoading || regionsLoading,
    getCitiesByCountry
  }
}