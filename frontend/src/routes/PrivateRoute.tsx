import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../context/userContextValue'

const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, loading } = useContext(UserContext)!

  if (loading) return null

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PrivateRoute
