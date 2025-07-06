import { api } from "@/lib/api"
import { 
    Document,
    DocumentResponseDto, 
    DocumentSearchParams, 
    UploadDocumentDto
  } from "@/types/document"

export const documentService = {
  async getDocuments(params?: DocumentSearchParams): Promise<DocumentResponseDto[]> {
    const searchParams = {
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      ...params
    }
    return api.get<DocumentResponseDto[]>('/documents', searchParams)
  },

  async getDocumentById(id: string): Promise<DocumentResponseDto> {
    return api.get<DocumentResponseDto>(`/documents/${id}`)
  },

  async uploadDocument(data: UploadDocumentDto): Promise<DocumentResponseDto> {
    const formData = new FormData()
    
    // Append file
    if (data.file) {
      formData.append('file', data.file)
    }
    
    // Append other fields
    formData.append('documentType', data.documentType)
    formData.append('title', data.title)
    
    if (data.description) {
      formData.append('description', data.description)
    }
    
    if (data.bookingId) {
      formData.append('bookingId', data.bookingId)
    }
    
    if (data.customerId) {
      formData.append('customerId', data.customerId)
    }
    
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag: string | Blob) => formData.append('tags', tag))
    }

    return api.post<DocumentResponseDto>('/documents/upload', formData)
  },

  async downloadAndSave(id: string, filename?: string): Promise<void> {
    return api.downloadAndSave(`/documents/${id}/download`, filename)
  },

  async downloadDocument(id: string): Promise<Blob> {
    return api.download(`/documents/${id}/download`)
  },

  async deleteDocument(id: string): Promise<void> {
    return api.delete<void>(`/documents/${id}`)
  },

  async getDocumentTypes(): Promise<string[]> {
    return api.get<string[]>('/documents/types')
  },

  // Helper method to get document download URL
  getDownloadUrl(id: string): string {
    return `/api/documents/${id}/download`
  },

  // Helper method to open document in new tab
  openDocument(id: string): void {
    window.open(this.getDownloadUrl(id), '_blank')
  },
  
  validateFile(file: File): string | null {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ]

    if (file.size > maxSize) {
      return `El archivo es muy grande. Tamaño máximo: ${(maxSize / 1024 / 1024).toFixed(1)}MB`
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de archivo no permitido'
    }

    return null // Archivo válido
  },

  // Método para formatear tamaño de archivo
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}