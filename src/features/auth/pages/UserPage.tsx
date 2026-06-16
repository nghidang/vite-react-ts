import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { ROUTES } from '../../../constants/route.constants'
import { NotificationPanel } from '../../notification'
import { logout } from '../stores/auth.slice'

export default function UserPage() {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.LOGIN)
  }

  return (
    <div>
      <h1>User Page</h1>
      <p>Xin chào, {user?.username} 👋</p>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>

      <NotificationPanel />
    </div>
  )
}
