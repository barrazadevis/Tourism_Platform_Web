import { HTMLAttributes, forwardRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Dialog({ open, onOpenChange, children, ...props }: DialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-card text-card-foreground rounded-lg shadow-xl max-w-md w-full mx-4 border border-border">
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-between p-6 border-b border-border", className)} {...props}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-lg font-semibold", className)} {...props}>
      {children}
    </h2>
  )
}

export function DialogContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  )
}

export function DialogClose({ onClose, className, ...props }: { onClose: () => void } & HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClose}
      className={cn("text-muted-foreground hover:text-foreground transition-colors", className)}
      {...props}
    >
      <X className="h-5 w-5" />
    </button>
  )
}