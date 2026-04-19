import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthCredentials, AuthRegisterInput, AuthUser } from '../types/auth'
import { createDemoJwt, decodeDemoJwt, isTokenExpired } from '../utils/jwt'

type AuthState = {
  user: AuthUser | null
  token: string | null
  hydrated: boolean
  setHydrated: (value: boolean) => void
  login: (credentials: AuthCredentials) => void
  register: (input: AuthRegisterInput) => void
  logout: () => void
  isAuthenticated: () => boolean
}

const buildToken = (user: AuthUser) =>
  createDemoJwt({
    sub: user.email,
    name: user.name,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  })

const sanitizeUser = (name: string, email: string): AuthUser => ({
  name: name.trim() || 'Scout User',
  email: email.trim().toLowerCase(),
})

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      login: ({ email }) => {
        const user = sanitizeUser(email.split('@')[0] ?? 'Scout User', email)
        const token = buildToken(user)
        set({ user, token })
      },
      register: ({ name, email }) => {
        const user = sanitizeUser(name, email)
        const token = buildToken(user)
        set({ user, token })
      },
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => {
        const { token } = get()
        return Boolean(token && !isTokenExpired(token) && decodeDemoJwt(token))
      },
    }),
    {
      name: 'scout-panel-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        if (state.token && isTokenExpired(state.token)) {
          state.logout()
        }
        state.setHydrated(true)
      },
    },
  ),
)
