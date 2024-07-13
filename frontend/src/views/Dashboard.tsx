import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from '~/components/Header'
import Sidebar from '~/components/Sidebar'
import WorkspaceModule from '~/modules/WorkspaceModule'
import DashboardPage from '~/pages/DashboardPage'
import ProfilePage from '~/pages/ProfilePage'
import Settings from '~/pages/Settings'
import { socket } from '~/utils/socket'
import { getToken } from '~/utils/token'

const Dashboard = () => {
  useEffect(() => {
    socket.connect()
    const { token } = getToken().refresh
    socket.emit('join', { token })
  }, [])

  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-span-2 h-screen bg-[white] ">
          <Sidebar />
        </div>
        <div className="col-span-10 h-screen bg-[#f8f9fb] ">
          <Header />
          <div className="py-5 px-[3rem] overflow-auto " style={{ height: 'calc(100vh - 100px)' }}>
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/workspaces/*" element={<WorkspaceModule />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
