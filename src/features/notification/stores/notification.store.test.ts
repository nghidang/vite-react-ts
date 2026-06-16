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
