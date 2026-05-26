import { useState, useEffect, createContext } from 'react'
import type { ReactNode } from 'react'
import { axiosInstance } from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'

interface UserData {
    token: string
    name?: string
    email?: string
    role?: 'admin' | 'user'
    profileImageUrl?: string
    [key: string]: unknown
}

interface UserContextValue {
    user: UserData | null
    loading: boolean
    updateUser: (userData: UserData) => void
    clearUser: () => void
}

export const UserContext = createContext<UserContextValue | null>(null)

 const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(() => !!localStorage.getItem('token'))

    useEffect(() => {
        if (user) return

        const accessToken = localStorage.getItem('token')
        if (!accessToken) return

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
                setUser(response.data)
            } catch (error) {
                console.error('Error fetching user:', error)
                setUser(null)
                localStorage.removeItem('token')
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateUser = (userData: UserData) => {
        setUser(userData)
        localStorage.setItem('token', userData.token)
        setLoading(false)
    }

    const clearUser = () => {
        setUser(null)
        localStorage.removeItem('token')
    }

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider