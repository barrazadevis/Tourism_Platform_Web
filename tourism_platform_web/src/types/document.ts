// Document Types and Enums
export enum DocumentType {
  Invoice = 'Invoice',
  Receipt = 'Receipt',
  Voucher = 'Voucher',
  Contract = 'Contract',
  Itinerary = 'Itinerary',
  Passport = 'Passport',
  Visa = 'Visa',
  Insurance = 'Insurance',
  Photo = 'Photo',
  Other = 'Other'
}

export enum DocumentStatus {
  Active = 'Active',
  Archived = 'Archived',
  Deleted = 'Deleted'
}

// Base Document interface
export interface Document {
  id: string
  title: string
  description?: string
  documentType: string
  fileName: string
  originalFileName: string
  filePath: string
  fileSize: number
  mimeType: string
  bookingId?: string
  customerId?: string
  tags: string[]
  status: DocumentStatus
  uploadedBy: string
  uploadedAt: string
  createdAt: string
  updatedAt: string
}

// Document Response DTO
export interface DocumentResponseDto extends Document {
  booking?: {
    id: string
    bookingNumber: string
    customerName: string
  }
  customer?: {
    id: string
    name: string
    email: string
  }
  downloadUrl: string
  thumbnailUrl?: string
  canDelete: boolean
  canDownload: boolean
}

// Upload Document DTO
export interface UploadDocumentDto {
  file: File
  documentType: string
  title: string
  description?: string
  bookingId?: string
  customerId?: string
  tags?: string[]
}

// Document Search Parameters
export interface DocumentSearchParams {
  documentType?: string
  bookingId?: string
  customerId?: string
  fromDate?: string
  toDate?: string
  page?: number
  pageSize?: number
  // Additional UI filters
  fileName?: string
  uploadedBy?: string
  status?: DocumentStatus
  tags?: string[]
  minFileSize?: number
  maxFileSize?: number
  mimeType?: string
}

// Document Search DTO (for backend)
export interface DocumentSearchDto {
  documentType?: string
  bookingId?: string
  customerId?: string
  fromDate?: string
  toDate?: string
  page: number
  pageSize: number
}

// Document Statistics (for dashboard)
export interface DocumentStats {
  totalDocuments: number
  documentsByType: DocumentTypeStat[]
  recentDocuments: DocumentResponseDto[]
  totalFileSize: number
  averageFileSize: number
  documentsThisMonth: number
  documentsToday: number
}

export interface DocumentTypeStat {
  documentType: string
  count: number
  totalSize: number
  averageSize: number
}

// File Upload Progress
export interface UploadProgress {
  fileName: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

// Document Filter Options (for UI components)
export interface DocumentFilterOptions {
  documentTypes: string[]
  uploaders: string[]
  tags: string[]
  dateRange: {
    min: string
    max: string
  }
  fileSizeRange: {
    min: number
    max: number
  }
}

// Bulk Document Operations
export interface BulkDocumentOperation {
  documentIds: string[]
  operation: 'delete' | 'archive' | 'move' | 'tag'
  parameters?: {
    newBookingId?: string
    newCustomerId?: string
    newTags?: string[]
    removeFromBooking?: boolean
    removeFromCustomer?: boolean
  }
}

// Document Preview
export interface DocumentPreview {
  id: string
  title: string
  documentType: string
  fileName: string
  fileSize: number
  mimeType: string
  thumbnailUrl?: string
  canPreview: boolean
  previewUrl?: string
}

// File Validation
export interface FileValidation {
  maxFileSize: number // in bytes
  allowedMimeTypes: string[]
  allowedExtensions: string[]
  maxFilesPerUpload: number
}

// Document Access Log
export interface DocumentAccessLog {
  id: string
  documentId: string
  action: 'download' | 'view' | 'delete' | 'update'
  userId: string
  userEmail: string
  accessedAt: string
  ipAddress?: string
  userAgent?: string
}

// Constants for file validation
export const FILE_VALIDATION: FileValidation = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
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
  ],
  allowedExtensions: [
    '.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp',
    '.doc', '.docx', '.xls', '.xlsx', '.txt'
  ],
  maxFilesPerUpload: 5
}

// Helper functions
export const getFileExtension = (fileName: string): string => {
  return fileName.substring(fileName.lastIndexOf('.'))
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getDocumentTypeText = (type: string): string => {
  switch (type) {
    case DocumentType.Invoice: return 'Factura'
    case DocumentType.Receipt: return 'Recibo'
    case DocumentType.Voucher: return 'Voucher'
    case DocumentType.Contract: return 'Contrato'
    case DocumentType.Itinerary: return 'Itinerario'
    case DocumentType.Passport: return 'Pasaporte'
    case DocumentType.Visa: return 'Visa'
    case DocumentType.Insurance: return 'Seguro'
    case DocumentType.Photo: return 'Foto'
    case DocumentType.Other: return 'Otro'
    default: return type
  }
}

export const getDocumentIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType === 'application/pdf') return '📄'
  if (mimeType.includes('word')) return '📝'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊'
  if (mimeType === 'text/plain') return '📋'
  return '📁'
}