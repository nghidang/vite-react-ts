import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppNotification } from '../notification.types'

interface NotificationState {
  items: AppNotification[]
  add: (message: string) => void
  markAllRead: () => void
  clear: () => void
}

// Tạo id không phụ thuộc Date.now/Math.random để dễ test; đủ unique cho client state.
// `seq` được khôi phục từ các id đã persist khi rehydrate (xem onRehydrateStorage)
// để id mới không trùng id cũ sau khi reload trang.
let seq = 0
const nextId = () => `n_${++seq}`

// Lấy số thứ tự lớn nhất từ các id dạng `n_<số>` để seed lại `seq`.
const highestSeq = (items: AppNotification[]) =>
  items.reduce((max, item) => {
    const n = Number(item.id.slice(2))
    return Number.isFinite(n) && n > max ? n : max
  }, 0)

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
    {
      name: 'notifications',
      // Sau khi khôi phục từ localStorage, tiếp tục đánh số từ id lớn nhất đã có
      // → tránh `add()` sinh ra id trùng (vd. `n_1`) với notification cũ.
      onRehydrateStorage: () => (state) => {
        if (state) seq = highestSeq(state.items)
      },
    }
  )
)

// Selector tách riêng — component chỉ re-render khi số chưa đọc đổi, không phải mọi thay đổi items
export const selectUnreadCount = (state: NotificationState) =>
  state.items.reduce((count, item) => (item.read ? count : count + 1), 0)
