import { getErrorMessage } from '../../helpers/getErrorMessage'

/**
 * Server trả 2xx nhưng payload thiếu user/token (dữ liệu không hợp lệ).
 * Tách riêng để component dịch ra message i18n phù hợp, phân biệt với lỗi mạng/HTTP.
 */
export class InvalidAuthDataError extends Error {
  constructor() {
    super('Invalid auth response')
    this.name = 'InvalidAuthDataError'
  }
}

/**
 * Map lỗi mutation (login/register) -> message hiển thị. Một kênh lỗi duy nhất:
 * dữ liệu rỗng dùng message riêng, còn lại lấy message server hoặc fallback. Trả '' nếu không có lỗi.
 * Nhận sẵn message đã dịch để helper không phụ thuộc i18n.
 */
export function resolveAuthError(
  error: unknown,
  messages: { invalidData: string; failed: string }
): string {
  if (!error) return ''
  if (error instanceof InvalidAuthDataError) return messages.invalidData
  return getErrorMessage(error, messages.failed)
}
