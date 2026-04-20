import { jwtDecode } from 'jwt-decode'

type JwtPayload = {
  exp?: number
  sub?: string
  email?: string
  name?: string
}

export function decodeJwt(token: string) {
  try {
    return jwtDecode<JwtPayload>(token)
  } catch {
    return null
  }
}

export function isTokenExpired(token: string) {
  const payload = decodeJwt(token)
  if (!payload?.exp) return true

  return payload.exp * 1000 <= Date.now()
}
