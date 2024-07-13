import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Signup from '~/pages/Signup'
import Login from '~/pages/Login'
import { useEffect, useState } from 'react'
import AddWorkspace from '~/pages/AddWorkspace'
import Dashboard from '~/views/Dashboard'

const AppRoutes: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('slark-token'))
  const location = useLocation()

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('slark-token'))
  }, [location.pathname])

  if (!isAuthenticated)
    return (
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/user/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/user/dashboard" /> : <Signup />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/user/dashboard" /> : <Login />} />
        <Route path="user/*" element={<Navigate to="/login" />} />
        <Route path="workspace/*" element={<AddWorkspace />} />
      </Routes>
    )

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/user/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/user/dashboard" /> : <Signup />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/user/dashboard" /> : <Login />} />

      <Route
        path="/user/*"
        element={
          <>
            <Dashboard />
          </>
        }
      />
    </Routes>
  )
}
export default AppRoutes
