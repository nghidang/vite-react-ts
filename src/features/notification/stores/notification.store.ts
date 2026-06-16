import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppNotification } from '../notification.types'

interface NotificationState {
  items: AppNotification[]
  add: (message: string) => void
  markAllRead: () => void
  clear: () => void
}

// Tạo id không phụ thuộc Date.now/Math.random để dễ test; đủ unique cho client state
let seq = 0
const nextId = () => `n_${++seq}`

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      items: [],
      add: (message) =>
        set((state) => ({
          items: [{ id: nextId(), message, read: false }, ...state.items],
        })),
      markAllRead: () =>
        set((state) => ({
          items: state.items.map((item) => ({ ...item, read: true })),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'notifications' }
  )
)

// Selector tách riêng — component chỉ re-render khi số chưa đọc đổi, không phải mọi thay đổi items
export const selectUnreadCount = (state: NotificationState) =>
  state.items.reduce((count, item) => (item.read ? count : count + 1), 0)
