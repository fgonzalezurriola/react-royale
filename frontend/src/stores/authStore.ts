import axios from 'axios'
import axiosSecure from '@/utils/axiosSecure'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Credentials, UserData } from '@/types/types'

type LoginResponse = {
  token?: string
  user?: Record<string, unknown>
}

interface AuthState {
  user: UserData | null
  token: string | null
}

interface AuthActions {
  login: (credentials: Credentials) => Promise<LoginResponse>
  restoreLogin: () => Promise<LoginResponse | null>
  logout: () => Promise<void>
  signup: (credentials: Credentials) => Promise<LoginResponse>
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (credentials: Credentials) => {
        const response = await axios.post('/api/login', credentials)
        const csrfToken = response.headers['x-csrf-token']

        if (csrfToken) {
          localStorage.setItem('csrfToken', csrfToken)
        }

        set({ user: response.data.user, token: response.data.token })
        return response.data
      },
      restoreLogin: async () => {
        try {
          const response = await axiosSecure.get('api/login/me')
          set({ user: response.data.user, token: response.data.token })
          return response.data
        } catch {
          return null
        }
      },
      logout: async () => {
        await axios.post('/api/login/logout')
        localStorage.removeItem('csrfToken')
        set({ user: null, token: null })
      },
      signup: async (credentials: Credentials) => {
        const response = await axios.post('/api/signup', credentials)
        const csrfToken = response.headers['x-csrf-token']

        if (csrfToken) {
          localStorage.setItem('csrfToken', csrfToken)
        }

        set({ user: response.data.user, token: response.data.token })
        return response.data
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
)
