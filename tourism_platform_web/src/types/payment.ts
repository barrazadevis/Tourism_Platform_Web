export interface Payment {
    id: string;
    paymentNumber: string;
    paymentDate: string;
    paymentMethod: string; // e.g., 'credit_card', 'bank_transfer'
    transactionId: string;
    currency: string;
    notes?: string;
    bookingId: string;
    amount: number;
    method: string; // e.g., 'credit_card', 'bank_transfer'
    paymentStatus: PaymentStatus;
    createdAt: string;
    updatedAt?: string;
    }
// Payment Status Enum
export enum PaymentStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Partial = 'Partial',
  Refunded = 'Refunded'
}

// Payment Method Enum
export enum PaymentMethod {
  CreditCard = 'CreditCard',
  DebitCard = 'DebitCard',
  BankTransfer = 'BankTransfer',
  Cash = 'Cash',
  Check = 'Check',
  PayPal = 'PayPal',
  Other = 'Other'
}

// Payment Response DTO
export interface PaymentResponseDto extends Payment {
  booking?: {
    id: string
    bookingNumber: string
    customerName: string
    totalAmount: number
  }
}

// Create Payment DTO
export interface CreatePaymentDto {
  bookingId: string
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  paymentDate: string
  dueDate?: string
  description?: string
  reference?: string
  transactionId?: string
  notes?: string
}

// Update Payment Status DTO
export interface UpdatePaymentStatusDto {
  status: PaymentStatus
  transactionId?: string
  notes?: string
}

// Payment Search Parameters
export interface PaymentSearchParams {
  page?: number
  pageSize?: number
  bookingId?: string
  status?: PaymentStatus
  paymentMethod?: PaymentMethod
  fromDate?: string
  toDate?: string
  minAmount?: number
  maxAmount?: number
  search?: string
}

// Payment Summary DTO
export interface PaymentSummaryDto {
  bookingId: string
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  currency: string
  paymentCount: number
  pendingPayments: number
  completedPayments: number
  failedPayments: number
  lastPaymentDate?: string
  nextDueDate?: string
}

// Payment Statistics (for dashboard)
export interface PaymentStats {
  totalRevenue: number
  pendingPayments: number
  completedPayments: number
  failedPayments: number
  recentPayments: PaymentResponseDto[]
}