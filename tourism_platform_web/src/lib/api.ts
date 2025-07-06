const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export class ApiError extends Error {
  public status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

class ApiClient {
  private baseURL: string
  
  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getAuthHeaders(isMultiPart: boolean): Record<string, string> {
    const token = localStorage.getItem('token') || null
    const headers: Record<string, string> = {
      'Content-Type': isMultiPart ? 'multipart/form-data' : 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }
  

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new ApiError(errorData.message || `HTTP ${response.status}`, response.status)
    }
    
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    
    return response.text() as unknown as T
  }

  private async handleBlobResponse(response: Response): Promise<Blob> {
    if (!response.ok) {
      // Para downloads, intentar leer como JSON primero para errores
      try {
        const errorData = await response.json()
        throw new ApiError(errorData.message || `HTTP ${response.status}`, response.status)
      } catch {
        throw new ApiError(`Download failed: HTTP ${response.status}`, response.status)
      }
    }
    
    return response.blob()
  }

  private async request<T>(
    endpoint: string,
    isMultiPart: boolean = false,
    options: RequestInit = {}
  ): Promise<T> {
    const config: RequestInit = {
      headers: {
        ...this.getAuthHeaders(isMultiPart),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config)
      return this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network error', 0)
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint
    return this.request<T>(url)
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, false,{
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(endpoint, true, {
      method: 'POST',
      body: formData
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, false, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, false, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, false, {
      method: 'DELETE',
    })
  }

  async download(endpoint: string): Promise<Blob> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const headers: Record<string, string> = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers,
      })

      return this.handleBlobResponse(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Download failed', 0)
    }
  }

  // Método helper para descargar y guardar archivo automáticamente
  async downloadAndSave(endpoint: string, filename?: string): Promise<void> {
    try {
      const blob = await this.download(endpoint)
      
      // Crear URL temporal para el blob
      const url = window.URL.createObjectURL(blob)
      
      // Crear elemento <a> temporal para trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = filename || 'document'
      a.style.display = 'none'
      
      // Agregar al DOM, hacer click y remover
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      throw error
    }
  }

  // Método para obtener URL de descarga (para previews o enlaces)
  getDownloadUrl(endpoint: string): string {
    return `${this.baseURL}${endpoint}`
  }

  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Para arrays, agregar cada elemento por separado
          value.forEach(item => formData.append(key, item.toString()))
        } else {
          formData.append(key, value.toString())
        }
      })
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const headers: Record<string, string> = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Upload failed', 0)
    }
  }
}

export const api = new ApiClient(API_BASE_URL)