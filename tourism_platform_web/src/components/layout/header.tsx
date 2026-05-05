'use client'

import { Bell, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 glass z-10 sticky top-0 flex items-center justify-between px-6 border-b border-border/50">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-foreground">
          Bienvenido, {user?.firstName}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/20 hover:text-secondary text-muted-foreground transition-colors">
          <Bell className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-2 bg-muted/50 rounded-full px-3 py-1 border border-border">
          <div className="bg-primary/10 p-1 rounded-full">
            <User className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">{user?.email}</span>
        </div>
        
        <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
