import axios from 'axios'
import axiosSecure from '@/utils/axiosSecure'
import type { Credentials } from '@/types/types'

const login = async (credentials: Credentials) => {
  const response = await axios.post('/api/login', credentials)

  const csrfToken = response.headers['x-csrf-token']

  if (csrfToken) {
    localStorage.setItem('csrfToken', csrfToken)
  }

  return response.data
}

const restoreLogin = async () => {
  try {
    const response = await axiosSecure.get('/api/login/me')
    return response.data
  } catch {
    return null
  }
}

const logout = async () => {
  await axios.post('/api/login/logout')
  localStorage.removeItem('csrfToken')
}

const signup = async (credentials: Credentials) => {
  const response = await axiosSecure.post('/api/users', credentials)
  return response.data
}

export const loginService = {
  login,
  restoreLogin,
  logout,
  signup,
}
