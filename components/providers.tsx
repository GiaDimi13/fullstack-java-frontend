'use client'

import { createContext, useState, useContext } from 'react'

type UserRole = 'customer' | 'admin'

interface AppContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
}

export const AppContext = createContext<AppContextType>({
  userRole: 'customer',
  setUserRole: () => {},
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('customer')

  return (
    <AppContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within a Providers component')
  }
  return context
}

