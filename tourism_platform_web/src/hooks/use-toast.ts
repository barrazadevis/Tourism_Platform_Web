// hooks/use-toast.ts
import { useState } from 'react'

export const useToast = () => ({
  toast: ({ title, description, variant }: any) => {
    console.error(title, description)
    // O usar alert temporalmente
    alert(`${title}: ${description}`)
  }
})