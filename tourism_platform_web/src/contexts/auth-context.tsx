'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'
import { ApiError } from '@/lib/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  companyId: string
  companyName: string
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  tenantSubdomain: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    validateToken()
  }, [])

  const validateToken = async () => {
    try {
      const token = authService.getToken()
      if (!token) {
        setIsLoading(false)
        logout()
        return
      }
    } catch (error) {
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setError(null)
    setIsLoading(true)
    
    try {
      const response = await authService.login({ email, password })
      setUser(response.user)
      
      // Redirect to tenant dashboard
      router.push(`/`)
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Login failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authService.register(data)
      setUser(response.user)
      router.push(`/`)
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError('Error al crear la cuenta')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}