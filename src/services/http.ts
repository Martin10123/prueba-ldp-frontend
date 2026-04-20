import type { ApiResponse } from '../types/api'
import { useAuthStore } from '../store/auth'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string
}

const isApiError = <T>(payload: ApiResponse<T>): payload is Extract<ApiResponse<T>, { success: false }> =>
  payload.success === false

export async function request<T>(path: string, options: RequestOptions = {}) {
  const authToken = options.token ?? useAuthStore.getState().token
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (response.status === 204) {
    return undefined as T
  }

  let payload: ApiResponse<T> | null = null

  try {
    const rawPayload = await response.text()
    if (rawPayload.trim().length > 0) {
      payload = JSON.parse(rawPayload) as ApiResponse<T>
    }
  } catch {
    throw new Error('Respuesta invalida del servidor')
  }

  if (!response.ok || (payload !== null && isApiError(payload))) {
    const message = payload !== null && isApiError(payload)
      ? payload.message
      : 'No se pudo completar la solicitud'
    throw new Error(message)
  }

  return payload ? payload.data : (undefined as T)
}
