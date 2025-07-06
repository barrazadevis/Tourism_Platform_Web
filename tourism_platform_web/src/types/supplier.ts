// Supplier Types and Enums
export enum SupplierType {
  Hotel = 'Hotel',
  Restaurant = 'Restaurant',
  Transportation = 'Transportation',
  TourOperator = 'TourOperator',
  Activity = 'Activity',
  Guide = 'Guide',
  Insurance = 'Insurance',
  RentalCar = 'RentalCar',
  Airline = 'Airline',
  Other = 'Other'
}

export enum SupplierStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
  Blocked = 'Blocked'
}

export enum PaymentTerms {
  Immediate = 'Immediate',
  Net15 = 'Net15',
  Net30 = 'Net30',
  Net60 = 'Net60',
  Net90 = 'Net90',
  Custom = 'Custom'
}

// Base Supplier interface
export interface Supplier {
  id: string
  name: string
  supplierType: string
  description?: string
  contactPerson: string
  email: string
  phone: string
  alternativePhone?: string
  website?: string
  address: string
  city: string
  state?: string
  country: string
  postalCode?: string
  taxId?: string
  bankAccount?: string
  paymentTerms: string
  creditLimit?: number
  currency: string
  rating?: number
  isActive: boolean
  isPreferred: boolean
  notes?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

// Supplier Response DTO
export interface SupplierResponseDto extends Supplier {
  totalContracts?: number
  totalBookings?: number
  totalPayments?: number
  lastBookingDate?: string
  averageRating?: number
  reviewCount?: number
  outstandingBalance?: number
}

// Create Supplier DTO
export interface CreateSupplierDto {
  name: string
  supplierType: string
  description?: string
  contactPerson: string
  email: string
  phone: string
  alternativePhone?: string
  website?: string
  address: string
  city: string
  state?: string
  country: string
  postalCode?: string
  taxId?: string
  bankAccount?: string
  paymentTerms: string
  creditLimit?: number
  currency: string
  isPreferred?: boolean
  notes?: string
  tags?: string[]
}

// Update Supplier DTO
export interface UpdateSupplierDto {
  name?: string
  supplierType?: string
  description?: string
  contactPerson?: string
  email?: string
  phone?: string
  alternativePhone?: string
  website?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  taxId?: string
  bankAccount?: string
  paymentTerms?: string
  creditLimit?: number
  currency?: string
  isPreferred?: boolean
  notes?: string
  tags?: string[]
}

// Supplier Search Parameters (matches controller parameters)
export interface SupplierSearchParams {
  searchTerm?: string
  supplierType?: string
  city?: string
  isActive?: boolean
  page?: number
  pageSize?: number
  // Additional UI filters
  country?: string
  state?: string
  isPreferred?: boolean
  paymentTerms?: string
  minRating?: number
  tags?: string[]
  hasOutstandingBalance?: boolean
  minCreditLimit?: number
  maxCreditLimit?: number
}

// Supplier Search DTO (for backend)
export interface SupplierSearchDto {
  searchTerm?: string
  supplierType?: string
  city?: string
  isActive?: boolean
  page: number
  pageSize: number
}

// Supplier Statistics (for dashboard)
export interface SupplierStats {
  totalSuppliers: number
  activeSuppliers: number
  inactiveSuppliers: number
  preferredSuppliers: number
  suppliersByType: SupplierTypeStat[]
  topSuppliersByBookings: SupplierResponseDto[]
  recentSuppliers: SupplierResponseDto[]
  averageRating: number
  totalOutstandingBalance: number
}

export interface SupplierTypeStat {
  supplierType: string
  count: number
  averageRating: number
}

// Supplier Contact Information
export interface SupplierContact {
  id: string
  supplierId: string
  name: string
  position: string
  email: string
  phone: string
  isPrimary: boolean
  department?: string
  notes?: string
}

// Supplier Contract
export interface SupplierContract {
  id: string
  supplierId: string
  contractNumber: string
  title: string
  description?: string
  startDate: string
  endDate: string
  contractValue: number
  currency: string
  paymentTerms: string
  status: 'Active' | 'Expired' | 'Terminated' | 'Draft'
  documentUrl?: string
  createdAt: string
  updatedAt: string
}

// Supplier Rating/Review
export interface SupplierReview {
  id: string
  supplierId: string
  bookingId?: string
  rating: number
  review?: string
  reviewerName: string
  reviewDate: string
  categories: {
    quality: number
    service: number
    value: number
    punctuality: number
  }
}

// Supplier Filter Options (for UI components)
export interface SupplierFilterOptions {
  supplierTypes: string[]
  cities: string[]
  countries: string[]
  paymentTerms: string[]
  tags: string[]
  ratingRange: {
    min: number
    max: number
  }
  creditLimitRange: {
    min: number
    max: number
  }
}

// Bulk Supplier Operations
export interface BulkSupplierOperation {
  supplierIds: string[]
  operation: 'activate' | 'deactivate' | 'delete' | 'update' | 'tag'
  parameters?: {
    isActive?: boolean
    isPreferred?: boolean
    supplierType?: string
    tags?: string[]
    paymentTerms?: string
  }
}

// Helper functions
export const getSupplierTypeText = (type: string): string => {
  switch (type) {
    case SupplierType.Hotel: return 'Hotel'
    case SupplierType.Restaurant: return 'Restaurante'
    case SupplierType.Transportation: return 'Transporte'
    case SupplierType.TourOperator: return 'Operador Turístico'
    case SupplierType.Activity: return 'Actividad'
    case SupplierType.Guide: return 'Guía'
    case SupplierType.Insurance: return 'Seguros'
    case SupplierType.RentalCar: return 'Alquiler de Autos'
    case SupplierType.Airline: return 'Aerolínea'
    case SupplierType.Other: return 'Otro'
    default: return type
  }
}

export const getPaymentTermsText = (terms: string): string => {
  switch (terms) {
    case PaymentTerms.Immediate: return 'Inmediato'
    case PaymentTerms.Net15: return 'Net 15'
    case PaymentTerms.Net30: return 'Net 30'
    case PaymentTerms.Net60: return 'Net 60'
    case PaymentTerms.Net90: return 'Net 90'
    case PaymentTerms.Custom: return 'Personalizado'
    default: return terms
  }
}

export const getSupplierStatusColor = (isActive: boolean, isPreferred: boolean): string => {
  if (!isActive) return 'bg-red-100 text-red-800'
  if (isPreferred) return 'bg-blue-100 text-blue-800'
  return 'bg-green-100 text-green-800'
}

export const getSupplierStatusText = (isActive: boolean, isPreferred: boolean): string => {
  if (!isActive) return 'Inactivo'
  if (isPreferred) return 'Preferido'
  return 'Activo'
}

export const formatCreditLimit = (amount: number, currency: string): string => {
  if (amount === 0) return 'Sin límite'
  return `${amount.toLocaleString()} ${currency}`
}

export const getSupplierIcon = (type: string): string => {
  switch (type) {
    case SupplierType.Hotel: return '🏨'
    case SupplierType.Restaurant: return '🍽️'
    case SupplierType.Transportation: return '🚌'
    case SupplierType.TourOperator: return '🎯'
    case SupplierType.Activity: return '🎪'
    case SupplierType.Guide: return '👨‍🏫'
    case SupplierType.Insurance: return '🛡️'
    case SupplierType.RentalCar: return '🚗'
    case SupplierType.Airline: return '✈️'
    default: return '🏢'
  }
}