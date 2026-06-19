import { describe, it, expect, beforeEach } from 'vitest'
import { useNotificationStore, selectUnreadCount } from './notification.store'

const state = () => useNotificationStore.getState()

describe('notification.store', () => {
  beforeEach(() => {
    useNotificationStore.setState({ items: [] })
  })

  it('add() prepends an unread notification', () => {
    state().add('first')
    state().add('second')

    const { items } = state()
    expect(items).toHaveLength(2)
    expect(items[0].message).toBe('second') // newest first
    expect(items[1].message).toBe('first')
    expect(items.every((i) => i.read === false)).toBe(true)
  })

  it('gives each notification a unique id', () => {
    state().add('a')
    state().add('b')
    const ids = state().items.map((i) => i.id)
    expect(new Set(ids).size).toBe(2)
  })

  it('markAllRead() marks every notification read', () => {
    state().add('a')
    state().add('b')
    state().markAllRead()
    expect(state().items.every((i) => i.read)).toBe(true)
  })

  it('does not reuse ids of already-persisted notifications after rehydrate', async () => {
    // Giả lập localStorage còn n_1, n_2 từ phiên trước rồi rehydrate.
    localStorage.setItem(
      'notifications',
      JSON.stringify({
        state: {
          items: [
            { id: 'n_2', message: 'old b', read: true },
            { id: 'n_1', message: 'old a', read: true },
          ],
        },
        version: 0,
      })
    )
    await useNotificationStore.persist.rehydrate()
    // onRehydrateStorage seed lại seq từ id lớn nhất → add() tiếp tục từ n_3.
    state().add('new')

    const ids = state().items.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length) // không trùng
    expect(ids[0]).toBe('n_3')
  })

  it('clear() removes all notifications', () => {
    state().add('a')
    state().clear()
    expect(state().items).toEqual([])
  })

  it('selectUnreadCount counts only unread notifications', () => {
    state().add('a')
    state().add('b')
    expect(selectUnreadCount(state())).toBe(2)
    state().markAllRead()
    expect(selectUnreadCount(state())).toBe(0)
  })
})
