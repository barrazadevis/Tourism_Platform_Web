import { useState, useEffect } from 'react'
import { ApiError } from '@/lib/api'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): ApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null
  })

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const data = await apiCall()
      setState({ data, loading: false, error: null })
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'An unexpected error occurred'
      setState({ data: null, loading: false, error: errorMessage })
    }
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  return {
    ...state,
    refetch: fetchData
  }
}