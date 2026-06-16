import { NavLink, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { PAGES, ROUTES } from '../../constants/route.constants'
import { selectIsAuthenticated } from '../../features/auth/stores/authSlice'
import {
  selectUnreadCount,
  useNotificationStore,
} from '../../features/notification/stores/notificationStore'
import { SearchBox } from '../../components/common/SearchBox/SearchBox'
import './Header.css'

// Các route được phép hiển thị ô search trên Header
const SEARCH_ROUTES: string[] = [ROUTES.PRODUCT_LIST, ROUTES.CART]

export function Header() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  // Zustand: chỉ subscribe số notification chưa đọc → re-render tối thiểu
  const unreadCount = useNotificationStore(selectUnreadCount)
  const location = useLocation()
  const showSearch = SEARCH_ROUTES.includes(location.pathname)

  return (
    <header className="header">
      <nav className="header__nav">
        {PAGES.map((page) => (
          <NavLink
            key={page.path}
            to={page.path}
            end={page.path === ROUTES.HOME}
            className="header__link"
          >
            {page.name}
          </NavLink>
        ))}

        {isAuthenticated ? (
          <NavLink to={ROUTES.USER} className="header__link header__link--user">
            User
            {unreadCount > 0 && (
              <span className="header__badge" aria-label={`${unreadCount} unread notifications`}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </NavLink>
        ) : (
          <NavLink to={ROUTES.LOGIN} className="header__link">
            Login
          </NavLink>
        )}

        {showSearch && <SearchBox />}
      </nav>
    </header>
  )
}
