import { useState } from 'react'
import { useApi } from '@/hooks/use-api'
import { destinationService } from '@/services/destinationService'
import { DestinationResponseDto, DestinationSearchParams, CreateDestinationDto, UpdateDestinationDto } from '@/types/destination'
import { ApiError } from '@/lib/api'

export function useDestinations(params?: DestinationSearchParams) {
  return useApi(
    () => destinationService.getDestinations(params),
    [params?.page, params?.pageSize, params?.query, params?.country]
  )
}

export function useDestination(id: string) {
  return useApi(
    () => destinationService.getDestinationById(id),
    [id]
  )
}

export function useDestinationMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDestination = async (data: CreateDestinationDto) => {
    try {
      setLoading(true)
      setError(null)
      const result = await destinationService.createDestination(data)
      return result
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Error creating destination'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateDestination = async (id: string, data: UpdateDestinationDto) => {
    try {
      setLoading(true)
      setError(null)
      const result = await destinationService.updateDestination(id, data)
      return result
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Error updating destination'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteDestination = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await destinationService.deleteDestination(id)
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Error deleting destination'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createDestination,
    updateDestination,
    deleteDestination,
    loading,
    error
  }
}