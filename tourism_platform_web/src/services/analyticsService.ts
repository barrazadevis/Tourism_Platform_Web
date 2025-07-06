import { api } from "@/lib/api"
import { 
    DashboardStatsDto,
    RevenueReportDto,
    TopCustomersDto,
    PopularDestinationsDto,
    MonthlyMetricsDto,
    AnalyticsParams
  } from "@/types/analytics"

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStatsDto> {
    return api.get<DashboardStatsDto>('/analytics/dashboard')
  },

  async getRevenueReport(fromDate: string, toDate: string): Promise<RevenueReportDto[]> {
    const params = {
      fromDate,
      toDate
    }
    return api.get<RevenueReportDto[]>('/analytics/revenue', params)
  },

  async getTopCustomers(limit: number = 10): Promise<TopCustomersDto[]> {
    const params = { limit: limit.toString() }
    return api.get<TopCustomersDto[]>('/analytics/top-customers', params)
  },

  async getPopularDestinations(limit: number = 10): Promise<PopularDestinationsDto[]> {
    const params = { limit: limit.toString() }
    return api.get<PopularDestinationsDto[]>('/analytics/popular-destinations', params)
  },

  async getMonthlyMetrics(months: number = 12): Promise<MonthlyMetricsDto[]> {
    const params = { months: months.toString() }
    return api.get<MonthlyMetricsDto[]>('/analytics/monthly-metrics', params)
  },

  async generateMonthlyMetrics(month?: string): Promise<void> {
    const params = month ? { month } : undefined
    return api.post<void>('/analytics/generate-monthly-metrics', params)
  },

  // Helper methods for common date ranges
  async getRevenueReportThisMonth(): Promise<RevenueReportDto[]> {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    return this.getRevenueReport(
      firstDay.toISOString().split('T')[0],
      lastDay.toISOString().split('T')[0]
    )
  },

  async getRevenueReportLastMonth(): Promise<RevenueReportDto[]> {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0)
    
    return this.getRevenueReport(
      firstDay.toISOString().split('T')[0],
      lastDay.toISOString().split('T')[0]
    )
  },

  async getRevenueReportThisYear(): Promise<RevenueReportDto[]> {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), 0, 1)
    const lastDay = new Date(now.getFullYear(), 11, 31)
    
    return this.getRevenueReport(
      firstDay.toISOString().split('T')[0],
      lastDay.toISOString().split('T')[0]
    )
  },

  async getRevenueReportLastYear(): Promise<RevenueReportDto[]> {
    const now = new Date()
    const firstDay = new Date(now.getFullYear() - 1, 0, 1)
    const lastDay = new Date(now.getFullYear() - 1, 11, 31)
    
    return this.getRevenueReport(
      firstDay.toISOString().split('T')[0],
      lastDay.toISOString().split('T')[0]
    )
  },

  async getRevenueReportCustomRange(days: number): Promise<RevenueReportDto[]> {
    const toDate = new Date()
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)
    
    return this.getRevenueReport(
      fromDate.toISOString().split('T')[0],
      toDate.toISOString().split('T')[0]
    )
  }
}