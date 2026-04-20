import type { ApiResponse } from '../types/api'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string
}

const isApiError = <T>(payload: ApiResponse<T>): payload is Extract<ApiResponse<T>, { success: false }> =>
  payload.success === false

export async function request<T>(path: string, options: RequestOptions = {}) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  let payload: ApiResponse<T> | null = null

  try {
    payload = (await response.json()) as ApiResponse<T>
  } catch {
    throw new Error('Respuesta invalida del servidor')
  }

  if (!response.ok || isApiError(payload)) {
    const message = isApiError(payload) ? payload.message : 'No se pudo completar la solicitud'
    throw new Error(message)
  }

  return payload.data
}
