import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import type { ReactNode } from 'react'
import { AuthBootstrap } from './AuthBootstrap'
import { authReducer } from '../features/auth'
import { refreshAuthToken } from '../services/token.refresh'

// Chỉ stub ranh giới I/O: refresh-on-load. Reducer auth dùng thật.
vi.mock('../services/token.refresh', () => ({ refreshAuthToken: vi.fn() }))

type Auth = {
  user: { id: string; username: string } | null
  token: string | null
  expireAt: number | null
}

const user = { id: '1', username: 'john' }

const renderWith = (auth: Auth, children: ReactNode = <div>App content</div>) => {
  const store = configureStore({ reducer: { auth: authReducer }, preloadedState: { auth } })
  return render(
    <Provider store={store}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </Provider>
  )
}

describe('AuthBootstrap', () => {
  beforeEach(() => vi.clearAllMocks())

  it('guest (không có user persisted): render app ngay, không gọi refresh', () => {
    renderWith({ user: null, token: null, expireAt: null })

    expect(screen.getByText('App content')).toBeInTheDocument()
    expect(refreshAuthToken).not.toHaveBeenCalled()
  })

  it('có user nhưng mất token (vừa F5): giữ splash tới khi refresh xong rồi mới render app', async () => {
    let resolveRefresh!: (token: string) => void
    vi.mocked(refreshAuthToken).mockReturnValue(
      new Promise((resolve) => {
        resolveRefresh = resolve
      })
    )

    renderWith({ user, token: null, expireAt: null })

    // Đang bootstrap: splash hiện, app CHƯA render (loading gate giữ router lại).
    expect(screen.getByText('Đang tải...')).toBeInTheDocument()
    expect(screen.queryByText('App content')).not.toBeInTheDocument()
    expect(refreshAuthToken).toHaveBeenCalledTimes(1)

    resolveRefresh('new-token')

    // Refresh xong → gate mở → app render (auth đã chốt, không nháy/giật).
    expect(await screen.findByText('App content')).toBeInTheDocument()
  })

  it('refresh thất bại: vẫn mở gate và render app (đã đăng xuất)', async () => {
    vi.mocked(refreshAuthToken).mockRejectedValue(new Error('no cookie'))

    renderWith({ user, token: null, expireAt: null })

    expect(screen.getByText('Đang tải...')).toBeInTheDocument()
    expect(await screen.findByText('App content')).toBeInTheDocument()
  })
})
