import React from 'react'
import { RxDashboard } from 'react-icons/rx'
import { BsPersonWorkspace } from 'react-icons/bs'
import { IoSettingsOutline } from 'react-icons/io5'
import { HiOutlineUserCircle } from 'react-icons/hi2'
import { useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate()
  const currentModule = useLocation().pathname.split('/')[2]

  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: <RxDashboard />,
      path: 'dashboard',
    },
    {
      title: 'Workspaces',
      icon: <BsPersonWorkspace />,
      path: 'workspaces',
    },
    {
      title: 'Settings',
      icon: <IoSettingsOutline />,
      path: 'settings',
    },
    {
      title: 'Profile',
      icon: <HiOutlineUserCircle size={22} />,
      path: 'profile',
    },
  ]

  return (
    <div className="flex flex-col  w-full p-5 ">
      <div className="flex items-center justify-center w-full">
        <h1 className="text-[35px] font-[600] text-center">Logo</h1>
      </div>
      <div className="flex flex-col mt-5 gap-2">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center p-3 rounded-md cursor-pointer  ${
              currentModule === item.path ? 'bg-indigo-700 text-[white]' : 'hover:bg-[#f8f9fb]'
            }  `}
            onClick={() => navigate(`/user/${item.path}`)}
          >
            {item.icon}
            <span className="ml-3">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
