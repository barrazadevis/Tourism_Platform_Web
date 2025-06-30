export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  tenantId: string
}
export interface Tenant {
  id: string
  name: string
  subdomain: string
  planType: string
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  documentType: string
  documentNumber: string
  totalQuotes: number
  totalBookings: number
  totalSpent: number
}

export interface Quote {
  id: string
  quoteNumber: string
  customerName: string
  destination: string
  departureDate: string
  returnDate: string
  totalAmount: number
  status: string
  validUntil: string
}

export interface Booking {
  id: string
  bookingNumber: string
  customerName: string
  departureDate: string
  returnDate: string
  status: string
  totalAmount: number
  totalPaid: number
  pendingAmount: number
}
