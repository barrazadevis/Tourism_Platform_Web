'use client'

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useTenant } from "@/contexts/tenant-context" // Necesario para obtener el tenant actual
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const { register, isLoading, error } = useAuth()
  const { currentTenant } = useTenant() // Obtener el tenant actual

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentTenant) {
      console.error('No se pudo determinar el tenant')
      return
    }
    
    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        tenantSubdomain: currentTenant.subdomain
      })
    } catch (error) {
      console.error('Register failed:', error)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">
          Crear Cuenta
        </CardTitle>
        {currentTenant && (
          <p className="text-sm text-muted-foreground">
            Registrándose en: {currentTenant.name}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Juan"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Apellido</label>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Pérez"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Contraseña</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !currentTenant}
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}