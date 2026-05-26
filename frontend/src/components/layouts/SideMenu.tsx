import { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data'

interface SideMenuProps {
  activeMenu: string
}

const SideMenu = ({ activeMenu }: SideMenuProps) => {
  const userContext = useContext(UserContext)
  const user = userContext?.user
  const clearUser = userContext?.clearUser

  const navigate = useNavigate()

  const sideMenuData = useMemo(() => {
    if (!user) return []
    return user.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
  }, [user])

  const handleLogout = () => {
    localStorage.clear()
    clearUser?.()
    navigate('/login')
  }

  const handleClick = (route: string) => {
    if (route === 'logout') {
      handleLogout()
      return
    }
    navigate(route)
  }

  return (
    <div className="w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200/50 sticky top-16 z-20">
      <div className="flex flex-col items-center  justify-center mb-7 pt-5">
        <div className="relative">
          <img src={user?.profileImageUrl || ""}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-40 rounded-full" />
        </div>

        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rouded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>

        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {sideMenuData.map((item, index) => (
        <button
        key={`menu_item_${index}`}
        className={`w-full flex items-center gap-4 text-[15px] ${activeMenu == item.label ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 boerder-r-3" :""} py-3 px-6 mb-3 cursor-pointer`}
        onClick={()=> handleClick(item.path)}>
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default SideMenu
