import { api, ApiError } from './api'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  tenantSubdomain: string
}

interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    companyId: string
    companyName: string
  }
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  companyId: string
  companyName: string
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      
      if (response.token) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
      }
      
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData)
      
      if (response.token) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
      }
      
      return response
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  },

  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser(): User | null {
    try {
      const userJson = localStorage.getItem('user')
      return userJson ? JSON.parse(userJson) : null
    } catch {
      return null
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  }
}