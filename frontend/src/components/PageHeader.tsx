import { useTransition } from 'react'
import { FaReact } from 'react-icons/fa'
import { LuCircleUser } from 'react-icons/lu'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import type { UserData } from '@/types/types'

interface PageHeaderProps {
  user: UserData | null
  logout: () => Promise<void>
}

const PageHeader = ({ user, logout }: PageHeaderProps) => {
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logout()
      navigate('/')
    })
  }

  return (
    <div className="flex justify-between m-4 px-3 py-2 border-1 shadow-sm rounded-full">
      <div className="flex items-center">
        <Link to="/" className="flex gap-2">
          <FaReact size="2em" />
          <h1 className="text-2xl font-semibold me-4">React Royale</h1>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link to="/profile" className="flex items-center">
              <LuCircleUser size="2em" /> <p className="px-2">{user.username}</p>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              data-testid="logout-button"
              disabled={isPending}
            >
              {isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="flex items-center" data-testid="login-link">
              <LuCircleUser size="2em" /> <p className="px-2">Login</p>
            </Link>
            <Link to="/signup" className="flex items-center" data-testid="signup-link">
              <LuCircleUser size="2em" /> <p className="px-2">Register</p>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default PageHeader
