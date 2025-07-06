// Analytics Types and Interfaces

// Dashboard Stats
export interface DashboardStatsDto {
  totalRevenue: number
  totalBookings: number
  totalCustomers: number
  totalQuotes: number
  averageBookingValue: number
  conversionRate: number
  pendingPayments: number
  activeSuppliers: number
  revenueGrowth: number
  bookingsGrowth: number
  customersGrowth: number
  quotesGrowth: number
  recentBookings: RecentBooking[]
  topDestinations: TopDestination[]
  upcomingTasks: UpcomingTask[]
}

export interface RecentBooking {
  id: string
  bookingNumber: string
  customerName: string
  destination: string
  totalAmount: number
  status: string
  createdAt: string
}

export interface TopDestination {
  destination: string
  bookingCount: number
  revenue: number
  percentage: number
}

export interface UpcomingTask {
  id: string
  title: string
  description: string
  dueDate: string
  priority: 'High' | 'Medium' | 'Low'
  type: 'Payment' | 'Booking' | 'Customer' | 'Other'
}

// Revenue Report
export interface RevenueReportDto {
  date: string
  totalRevenue: number
  bookingRevenue: number
  serviceRevenue: number
  bookingCount: number
  averageBookingValue: number
  currency: string
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

// Top Customers
export interface TopCustomersDto {
  customerId: string
  customerName: string
  email: string
  totalBookings: number
  totalRevenue: number
  averageBookingValue: number
  lastBookingDate: string
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  preferredDestinations: string[]
}

// Popular Destinations
export interface PopularDestinationsDto {
  destination: string
  bookingCount: number
  revenue: number
  averageBookingValue: number
  growthRate: number
  seasonality: SeasonalityData[]
  topPlanTypes: DestinationPlanType[]
}

export interface SeasonalityData {
  month: number
  bookingCount: number
  revenue: number
}

export interface DestinationPlanType {
  planType: string
  count: number
  revenue: number
}

// Monthly Metrics
export interface MonthlyMetricsDto {
  year: number
  month: number
  totalRevenue: number
  totalBookings: number
  newCustomers: number
  totalQuotes: number
  conversionRate: number
  averageBookingValue: number
  totalPayments: number
  pendingPayments: number
  cancelledBookings: number
  refundedAmount: number
  supplierPayments: number
  netProfit: number
  customerAcquisitionCost: number
  lifetimeValue: number
  bookingsByDestination: DestinationMetric[]
  bookingsByPlanType: PlanTypeMetric[]
  paymentsByMethod: PaymentMethodMetric[]
}

export interface DestinationMetric {
  destination: string
  bookingCount: number
  revenue: number
}

export interface PlanTypeMetric {
  planType: string
  bookingCount: number
  revenue: number
}

export interface PaymentMethodMetric {
  paymentMethod: string
  count: number
  amount: number
}

// Analytics Parameters
export interface AnalyticsParams {
  fromDate?: string
  toDate?: string
  limit?: number
  months?: number
  groupBy?: 'day' | 'week' | 'month' | 'year'
  currency?: string
}

// Chart Data Interfaces
export interface ChartDataPoint {
  label: string
  value: number
  date?: string
  color?: string
  percentage?: number
}

export interface LineChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    fill?: boolean
  }[]
}

export interface PieChartData {
  labels: string[]
  datasets: {
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}

export interface BarChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
    borderWidth: number
  }[]
}

// Performance Metrics
export interface PerformanceMetrics {
  kpis: KPI[]
  trends: Trend[]
  comparisons: Comparison[]
}

export interface KPI {
  name: string
  value: number
  previousValue: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  target?: number
  unit: string
  format: 'currency' | 'percentage' | 'number'
}

export interface Trend {
  metric: string
  period: string
  data: TrendDataPoint[]
  direction: 'up' | 'down' | 'stable'
}

export interface TrendDataPoint {
  date: string
  value: number
}

export interface Comparison {
  metric: string
  currentPeriod: ComparisonPeriod
  previousPeriod: ComparisonPeriod
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
}

export interface ComparisonPeriod {
  label: string
  value: number
  startDate: string
  endDate: string
}

// Report Filters
export interface ReportFilters {
  dateRange: DateRange
  destinations?: string[]
  planTypes?: string[]
  customers?: string[]
  suppliers?: string[]
  paymentMethods?: string[]
  bookingStatus?: string[]
  currency?: string
}

export interface DateRange {
  start: string
  end: string
  preset?: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom'
}

// Export Options
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv'
  includeCharts: boolean
  dateRange: DateRange
  sections: string[]
}

// Helper functions
export const formatCurrency = (amount: number, currency: string = 'COP'): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-CO').format(value)
}

export const getGrowthColor = (growth: number): string => {
  if (growth > 0) return 'text-green-600'
  if (growth < 0) return 'text-red-600'
  return 'text-gray-600'
}

export const getGrowthIcon = (growth: number): string => {
  if (growth > 0) return '↗️'
  if (growth < 0) return '↘️'
  return '→'
}

export const getPeriodLabel = (period: string): string => {
  switch (period) {
    case 'daily': return 'Diario'
    case 'weekly': return 'Semanal'
    case 'monthly': return 'Mensual'
    case 'yearly': return 'Anual'
    default: return period
  }
}

export const getDateRangePresets = (): { label: string; value: string; start: Date; end: Date }[] => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  const thisWeekStart = new Date(today)
  thisWeekStart.setDate(today.getDate() - today.getDay())
  
  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)
  const lastWeekEnd = new Date(thisWeekStart)
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 1)
  
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
  
  const thisYearStart = new Date(today.getFullYear(), 0, 1)
  const lastYearStart = new Date(today.getFullYear() - 1, 0, 1)
  const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31)

  return [
    { label: 'Hoy', value: 'today', start: today, end: today },
    { label: 'Ayer', value: 'yesterday', start: yesterday, end: yesterday },
    { label: 'Esta semana', value: 'thisWeek', start: thisWeekStart, end: today },
    { label: 'Semana pasada', value: 'lastWeek', start: lastWeekStart, end: lastWeekEnd },
    { label: 'Este mes', value: 'thisMonth', start: thisMonthStart, end: today },
    { label: 'Mes pasado', value: 'lastMonth', start: lastMonthStart, end: lastMonthEnd },
    { label: 'Este año', value: 'thisYear', start: thisYearStart, end: today },
    { label: 'Año pasado', value: 'lastYear', start: lastYearStart, end: lastYearEnd }
  ]
}

// Chart color palettes
export const chartColors = {
  primary: ['#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'],
  success: ['#10B981', '#059669', '#047857', '#065F46'],
  warning: ['#F59E0B', '#D97706', '#B45309', '#92400E'],
  danger: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B'],
  info: ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF']
}