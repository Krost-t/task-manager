import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { axiosInstance } from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { UserContext } from './userContextValue'
import type { UserData } from './userContextValue'

const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(() => !!localStorage.getItem('token'))

    useEffect(() => {
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