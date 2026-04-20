import type { AuthCredentials, AuthRegisterInput, AuthUser, AuthWithToken } from '../types/auth'
import { request } from './http'

export async function loginRequest(credentials: AuthCredentials) {
  return request<AuthWithToken>('/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

export async function registerRequest(input: AuthRegisterInput) {
  return request<AuthWithToken>('/auth/register', {
    method: 'POST',
    body: input,
  })
}

export async function meRequest(token: string) {
  return request<AuthUser>('/auth/me', {
    method: 'GET',
    token,
  })
}
