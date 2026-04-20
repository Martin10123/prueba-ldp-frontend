import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthCredentials, AuthRegisterInput, AuthUser } from '../types/auth'
import { isTokenExpired } from '../utils/jwt'
import { loginRequest, meRequest, registerRequest } from '../services/auth'

export type AuthState = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  hydrated: boolean
  loading: boolean
  error: string | null
  login: (credentials: AuthCredentials) => Promise<void>
  register: (input: AuthRegisterInput) => Promise<void>
  initializeSession: () => Promise<void>
  clearError: () => void
  logout: () => void
}

const AUTH_STORAGE_KEY = 'scout-panel-auth'

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return 'No se pudo completar la autenticacion'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hydrated: false,
      loading: false,
      error: null,
      clearError: () => set({ error: null }),
      login: async (credentials) => {
        set({ loading: true, error: null })
        try {
          const { user, token } = await loginRequest(credentials)
          set({ user, token, isAuthenticated: true })
        } catch (error) {
          set({ error: getErrorMessage(error), isAuthenticated: false })
          throw error
        } finally {
          set({ loading: false })
        }
      },
      register: async (input) => {
        set({ loading: true, error: null })
        try {
          const { user, token } = await registerRequest(input)
          set({ user, token, isAuthenticated: true })
        } catch (error) {
          set({ error: getErrorMessage(error), isAuthenticated: false })
          throw error
        } finally {
          set({ loading: false })
        }
      },
      initializeSession: async () => {
        const token = get().token

        if (!token || isTokenExpired(token)) {
          set({ user: null, token: null, isAuthenticated: false, hydrated: true })
          return
        }

        set({ loading: true, error: null })
        try {
          const user = await meRequest(token)
          set({ user, isAuthenticated: true, hydrated: true })
        } catch {
          set({ user: null, token: null, isAuthenticated: false, hydrated: true })
        } finally {
          set({ loading: false })
        }
      },
      logout: () => set({ user: null, token: null, isAuthenticated: false, error: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        void state.initializeSession()
      },
    },
  ),
)
