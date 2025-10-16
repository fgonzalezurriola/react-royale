import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { loginService } from '@/services/login'
import type { UserData, Credentials } from '@/types/types'

interface AuthContextType {
  user: UserData | null
  login: (credentials: Credentials) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const init = async () => {
      const user = await loginService.restoreLogin()
      setUser(user)
    }
    init()
  }, [])

  const login = async (credentials: Credentials) => {
    await loginService.login(credentials)
    const userData = await loginService.restoreLogin()
    setUser(userData)
  }

  const logout = async () => {
    await loginService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
