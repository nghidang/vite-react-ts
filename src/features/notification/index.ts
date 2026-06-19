/**
 * Public API của feature `notification`.
 * Code ngoài feature CHỈ được import từ đây.
 */
export { useNotificationStore, selectUnreadCount } from './stores/notification.store'
export { NotificationPanel } from './components/NotificationPanel/NotificationPanel'
export {
  showOsNotification,
  requestOsPermission,
  getOsPermission,
  isOsNotificationSupported,
  type OsPermission,
} from './services/notification.service'
