import { useAppSelector } from '../../../app/hooks'
import { NotificationPanel } from '../../notification'
import { useLogout } from '../hooks/useLogout'

export default function UserPage() {
  const user = useAppSelector((state) => state.auth.user)
  const handleLogout = useLogout()

  return (
    <div>
      <h1>User Page</h1>
      <p>Xin chào, {user?.username} 👋</p>
      <button type="button" onClick={() => void handleLogout()}>
        Logout
      </button>

      <NotificationPanel />
    </div>
  )
}
