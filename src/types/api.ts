export type ApiSuccess<T> = {
  success: true
  data: T
}

export type ApiError = {
  success: false
  error: string
  message: string
  issues?: Array<Record<string, unknown>>
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
