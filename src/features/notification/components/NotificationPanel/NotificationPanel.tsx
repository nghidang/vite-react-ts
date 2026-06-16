import { useNotificationStore } from '../../stores/notification.store'
import './NotificationPanel.css'

export function NotificationPanel() {
  // Zustand: lấy actions trực tiếp từ store, không cần dispatch/Provider
  const items = useNotificationStore((state) => state.items)
  const add = useNotificationStore((state) => state.add)
  const markAllRead = useNotificationStore((state) => state.markAllRead)
  const clear = useNotificationStore((state) => state.clear)

  return (
    <section className="notification-panel">
      <h2>Notifications ({items.length})</h2>
      <div className="notification-panel__actions">
        <button type="button" onClick={() => add('Bạn có thông báo mới')}>
          Thêm notification
        </button>
        <button type="button" onClick={markAllRead}>
          Đánh dấu đã đọc
        </button>
        <button type="button" onClick={clear}>
          Xoá hết
        </button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.read ? '✓ ' : '• '}
            {item.message}
          </li>
        ))}
      </ul>
    </section>
  )
}
