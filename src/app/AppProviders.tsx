import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { LangProvider } from '../i18n/LangProvider'
import { AuthBootstrap } from './AuthBootstrap'
import { queryClient } from './query.client'
import { store } from './store'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthBootstrap>{children}</AuthBootstrap>
          </BrowserRouter>
        </QueryClientProvider>
      </ReduxProvider>
    </LangProvider>
  )
}
