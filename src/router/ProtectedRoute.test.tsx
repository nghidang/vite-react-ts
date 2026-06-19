import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { authReducer } from '../features/auth'

const empty = {
  user: null as { id: string; username: string } | null,
  token: null as string | null,
  expireAt: null as number | null,
}

const renderAt = (auth: typeof empty) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth },
  })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/user']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/user" element={<div>User page</div>} />
          </Route>
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('ProtectedRoute', () => {
  it('renders the protected page when authenticated', () => {
    renderAt({ ...empty, token: 'abc' })
    expect(screen.getByText('User page')).toBeInTheDocument()
  })

  it('redirects to /login when not authenticated', () => {
    renderAt(empty)
    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('User page')).not.toBeInTheDocument()
  })
})
