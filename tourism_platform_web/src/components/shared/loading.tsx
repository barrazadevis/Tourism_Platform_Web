import { Loader2 } from 'lucide-react'

interface LoadingProps {
  message?: string
}

export function Loading({ message = "Cargando..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  )
}