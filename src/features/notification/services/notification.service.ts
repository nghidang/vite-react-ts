/**
 * Bọc Web Notifications API (notification cấp OS) để tách side-effect khỏi store.
 * Store giữ thuần (dễ test); UI gọi service này khi muốn bắn notification ra OS.
 */

const isSupported = typeof window !== 'undefined' && 'Notification' in window

export type OsPermission = NotificationPermission | 'unsupported'

export function isOsNotificationSupported(): boolean {
  return isSupported
}

export function getOsPermission(): OsPermission {
  return isSupported ? Notification.permission : 'unsupported'
}

/** Hỏi quyền 1 lần; nếu đã quyết định (granted/denied) thì trả về luôn, không hỏi lại. */
export async function requestOsPermission(): Promise<OsPermission> {
  if (!isSupported) return 'unsupported'
  if (Notification.permission !== 'default') return Notification.permission
  return Notification.requestPermission()
}

/**
 * Hiển thị notification OS. No-op nếu chưa được cấp quyền — gọi an toàn ở mọi nơi.
 * `tag` mặc định để trống → mỗi lần gọi là một notification riêng (OS hiện lại mỗi lần).
 * Truyền `tag` cùng giá trị nếu muốn các notification cùng loại GỘP/thay thế tại chỗ.
 */
export function showOsNotification(title: string, body?: string, tag?: string): void {
  if (!isSupported || Notification.permission !== 'granted') return
  new Notification(title, tag ? { body, tag } : { body })
}
