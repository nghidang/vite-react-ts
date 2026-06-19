import { useState } from 'react'
import {
  getOsPermission,
  requestOsPermission,
  showOsNotification,
  type OsPermission,
} from '../../services/notification.service'
import { useNotificationStore } from '../../stores/notification.store'
import './NotificationPanel.css'

export function NotificationPanel() {
  // Zustand: lấy actions trực tiếp từ store, không cần dispatch/Provider
  const items = useNotificationStore((state) => state.items)
  const add = useNotificationStore((state) => state.add)
  const markAllRead = useNotificationStore((state) => state.markAllRead)
  const clear = useNotificationStore((state) => state.clear)

  const [permission, setPermission] = useState<OsPermission>(getOsPermission)

  const handleEnable = async () => {
    setPermission(await requestOsPermission())
  }

  const handleAdd = () => {
    const message = 'Bạn có thông báo mới'
    add(message) // state trong app (badge + list)
    showOsNotification('Thông báo mới', message) // notification cấp OS
  }

  return (
    <section className="notification-panel">
      <h2>Notifications ({items.length})</h2>

      {permission === 'unsupported' ? (
        <p className="notification-panel__hint">Trình duyệt không hỗ trợ thông báo OS.</p>
      ) : permission === 'denied' ? (
        <p className="notification-panel__hint">
          Thông báo OS đang bị chặn — hãy bật lại trong cài đặt trình duyệt cho trang này.
        </p>
      ) : (
        permission === 'default' && (
          <button type="button" onClick={handleEnable}>
            Bật thông báo OS
          </button>
        )
      )}

      <div className="notification-panel__actions">
        <button type="button" onClick={handleAdd}>
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
