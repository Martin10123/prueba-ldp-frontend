export type AuthUser = {
  name: string
  email: string
}

export type AuthCredentials = {
  email: string
  password: string
}

export type AuthRegisterInput = AuthCredentials & {
  name: string
}
