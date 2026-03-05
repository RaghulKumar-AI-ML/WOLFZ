import { create } from 'zustand'
import * as authService from '../services/authService'

const TOKEN_KEY = 'wolfz_access_token'

export const useAuthStore = create((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  loading: false,
  error: null,

  initialize: async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return set({ token: null, user: null })
    try {
      const user = await authService.me()
      set({ token, user, error: null })
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      set({ token: null, user: null })
    }
  },

  registerAndLogin: async ({ email, username, password }) => {
    set({ loading: true, error: null })
    try {
      await authService.register({ email, username, password })
      const session = await authService.login({ username, password })
      localStorage.setItem(TOKEN_KEY, session.access_token)
      const user = await authService.me()
      set({ token: session.access_token, user, loading: false, error: null })
      return true
    } catch (error) {
      set({ loading: false, error: error?.response?.data?.detail || 'Registration failed' })
      return false
    }
  },

  login: async ({ username, password }) => {
    set({ loading: true, error: null })
    try {
      const session = await authService.login({ username, password })
      localStorage.setItem(TOKEN_KEY, session.access_token)
      const user = await authService.me()
      set({ token: session.access_token, user, loading: false, error: null })
      return true
    } catch (error) {
      set({ loading: false, error: error?.response?.data?.detail || 'Invalid credentials' })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ token: null, user: null, error: null })
  },

  updateProfile: async (payload) => {
    const user = await authService.updateProfile(payload)
    set({ user })
    return user
  },

  isAuthenticated: () => Boolean(get().token),
}))
