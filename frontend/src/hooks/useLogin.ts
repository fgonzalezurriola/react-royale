import { useEffect, useState } from 'react'
import { loginService } from '@/services/login'
import type { UserData, Credentials } from '@/types/types'

const useLogin = () => {
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

  return { user, login, logout }
}

export { useLogin }
