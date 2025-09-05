import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface User {
  id: string
  email: string
  username: string
  full_name: string
  is_active: boolean
  created_at: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password,
          }, {
            headers: {
              'Content-Type': 'application/json',
            }
          })

          const { access_token, user } = response.data
          
          set({
            token: access_token,
            user: user,
            isAuthenticated: true,
          })
        } catch (error: any) {
          throw new Error(error.response?.data?.detail || 'Login failed')
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const response = await axios.post(`${API_URL}/api/auth/register`, {
            full_name: name,
            email,
            username: email, // Use email as username for simplicity
            password,
          })

          const { access_token, user } = response.data
          
          set({
            token: access_token,
            user: user,
            isAuthenticated: true,
          })
        } catch (error: any) {
          throw new Error(error.response?.data?.detail || 'Registration failed')
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      refreshToken: async () => {
        const { token } = get()
        if (!token) return

        try {
          const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          set({
            user: userResponse.data,
            isAuthenticated: true,
          })
        } catch (error) {
          // Token is invalid, logout
          get().logout()
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Axios interceptor for auth
axios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)
