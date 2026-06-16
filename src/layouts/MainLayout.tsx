import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { RouteFallback } from '../components/common/RouteFallback/RouteFallback'
import { Footer } from './Footer/Footer'
import { Header } from './Header/Header'
import './layouts.css'

export function MainLayout() {
  return (
    <div className="main-layout">
      <Header />

      <main>
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
