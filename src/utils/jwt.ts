type JwtPayload = {
  sub: string
  name: string
  email: string
  exp: number
  iat: number
}

function base64UrlEncode(value: string) {
  return btoa(unescape(encodeURIComponent(value)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return decodeURIComponent(escape(atob(padded)))
}

export function createDemoJwt(payload: Omit<JwtPayload, 'iat'>) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const iat = Math.floor(Date.now() / 1000)
  const tokenPayload: JwtPayload = { ...payload, iat }

  return [base64UrlEncode(JSON.stringify(header)), base64UrlEncode(JSON.stringify(tokenPayload)), 'demo-signature'].join('.')
}

export function decodeDemoJwt(token: string) {
  const [, payload] = token.split('.')
  if (!payload) return null

  try {
    return JSON.parse(base64UrlDecode(payload)) as JwtPayload
  } catch {
    return null
  }
}

export function isTokenExpired(token: string) {
  const payload = decodeDemoJwt(token)
  if (!payload) return true

  return payload.exp * 1000 < Date.now()
}
