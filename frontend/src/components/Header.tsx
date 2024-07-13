import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { AiOutlineBell } from 'react-icons/ai'
import prolfile_img from '../assets/user_profile.png'
import { useNavigate } from 'react-router-dom'
import { useGetMe } from '~/hooks/user'
import { useLogout } from '~/hooks/auth'

const Header = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const profile_ref = useRef<any>()

  const { user, isFetching } = useGetMe()
  const { logout } = useLogout()

  const toggleProfileBox = (event: any) => {
    if (showMenu && (profile_ref.current === event.target || profile_ref.current?.contains(event.target))) {
      setShowMenu(true)
    } else {
      setShowMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', toggleProfileBox)

    return () => {
      document.removeEventListener('click', toggleProfileBox)
    }
  }, [showMenu])

  return (
    <header className=" flex items-center justify-between  px-10  h-[100px] ">
      <div></div>
      <div className="flex items-center">
        <AiOutlineBell size={20} className="mx-5 cursor-pointer " />
        <div className="flex items-center cursor-pointer " ref={profile_ref} onClick={() => setShowMenu(!showMenu)}>
          <img src={prolfile_img} alt="avatar" className="w-8 h-8 rounded-full" />
          <span className="ml-2">{user?.name}</span>
        </div>
      </div>
      {showMenu && (
        <div className="absolute bg-[white] p-2 w-[130px] right-[2rem] top-[75px] rounded-lg shadow-lg ">
          <ul>
            <li className="p-2 hover:bg-gray-200 cursor-pointer rounded" onClick={() => navigate('/user/profile')}>
              Profile
            </li>
            <li className="p-2 hover:bg-gray-200 cursor-pointer rounded" onClick={() => navigate('/user/settings')}>
              Settings
            </li>
            <li className="p-2 hover:bg-gray-200 cursor-pointer rounded" onClick={() => logout()}>
              Logout
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Header
