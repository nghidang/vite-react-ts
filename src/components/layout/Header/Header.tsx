import { NavLink, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { PAGES, ROUTES } from '../../../constants/route.constants'
import { selectIsAuthenticated } from '../../../features/auth/stores/authSlice'
import { SearchBox } from '../../common/SearchBox/SearchBox'
import './Header.css'

// Các route được phép hiển thị ô search trên Header
const SEARCH_ROUTES: string[] = [ROUTES.PRODUCT_LIST, ROUTES.CART]

export function Header() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
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
          <NavLink to={ROUTES.USER} className="header__link">
            User
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
