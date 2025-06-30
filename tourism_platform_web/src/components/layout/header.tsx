'use client'

import { Bell, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Bienvenido, {user?.firstName}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <User className="h-8 w-8 text-gray-400" />
          <span className="text-sm text-gray-700">{user?.email}</span>
        </div>
        
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
