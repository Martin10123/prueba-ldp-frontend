import { useAuthStore } from '../store/auth'
import { useShallow } from 'zustand/react/shallow'
import type { AuthState } from '../store/auth'

type AuthSessionSlice = Pick<
  AuthState,
  'user' | 'token' | 'hydrated' | 'isAuthenticated' | 'loading' | 'error'
>

type AuthActionsSlice = Pick<
  AuthState,
  'login' | 'register' | 'logout' | 'clearError' | 'initializeSession'
>

export const useAuthSession = (): AuthSessionSlice =>
  useAuthStore(
    useShallow((state) => ({
      user: state.user,
      token: state.token,
      hydrated: state.hydrated,
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      error: state.error,
    })),
  )

export const useAuthActions = (): AuthActionsSlice =>
  useAuthStore(
    useShallow((state) => ({
      login: state.login,
      register: state.register,
      logout: state.logout,
      clearError: state.clearError,
      initializeSession: state.initializeSession,
    })),
  )
