export type ApiResponse<T> = {
  success: boolean
  data: T
}

/** Body trả về khi request lỗi, vd: res.status(401).json({ message }) */
export type ApiError = {
  message: string
}
