import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../store/auth'
import { loginRequest } from '../services/auth'

vi.mock('../services/auth', () => ({
  loginRequest: vi.fn(),
  registerRequest: vi.fn(),
  meRequest: vi.fn(),
}))

vi.mock('../utils/jwt', () => ({
  isTokenExpired: vi.fn(() => false),
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      hydrated: true,
      loading: false,
      error: null,
    })
    vi.clearAllMocks()
  })

  it('autentica al usuario cuando el login responde correctamente', async () => {
    const mockedLoginRequest = vi.mocked(loginRequest)

    mockedLoginRequest.mockResolvedValue({
      token: 'jwt-token',
      user: {
        id: 'user-1',
        name: 'Scout User',
        email: 'scout@ldp.com',
        role: 'USER',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    })

    await useAuthStore.getState().login({
      email: 'scout@ldp.com',
      password: '123456',
    })

    const state = useAuthStore.getState()
    expect(mockedLoginRequest).toHaveBeenCalledOnce()
    expect(state.isAuthenticated).toBe(true)
    expect(state.token).toBe('jwt-token')
    expect(state.user?.email).toBe('scout@ldp.com')
    expect(state.loading).toBe(false)
  })

  it('expone error y mantiene la sesion cerrada cuando el login falla', async () => {
    const mockedLoginRequest = vi.mocked(loginRequest)
    mockedLoginRequest.mockRejectedValue(new Error('Credenciales invalidas'))

    await expect(
      useAuthStore.getState().login({
        email: 'scout@ldp.com',
        password: 'incorrecta',
      }),
    ).rejects.toThrow('Credenciales invalidas')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBeNull()
    expect(state.error).toBe('Credenciales invalidas')
    expect(state.loading).toBe(false)
  })
})
