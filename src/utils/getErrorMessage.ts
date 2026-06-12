import axios from 'axios'
import { t } from '../i18n'
import type { ApiError } from '../types/api.types'

/**
 * Rút thông điệp lỗi thân thiện từ một lỗi bất kỳ.
 * Ưu tiên `message` mà server trả về (vd: res.status(401).json({ message })), nếu không có thì dùng fallback.
 * Cố ý không trả về `error.message` thô của axios (vd "Network Error") để tránh lộ chi tiết kỹ thuật cho người dùng.
 */
export function getErrorMessage(error: unknown, fallback?: string): string {
  const fallbackMessage = fallback ?? t('common.error.default')

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined
    return data?.message ?? fallbackMessage
  }

  return fallbackMessage
}
