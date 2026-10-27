import { createContext } from 'react'

export interface UserData {
    token: string
    name?: string
    email?: string
    role?: 'admin' | 'user' | 'member'
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
