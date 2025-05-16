"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

// Define types
interface User {
  id: number
  username: string
  name: string
  email: string
  bio: string
  website: string
  avatar: string
  followers: number
  following: number
  posts: number
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  // login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  error: string | null
  getUserByUsername: (username: string) => User | null
  followUser: (userId: number) => boolean
  unfollowUser: (userId: number) => boolean
  isFollowing: (userId: number) => boolean
}

// Sample user data
const SAMPLE_USERS: User[] = [
  {
    id: 1,
    username: "johndoe",
    name: "John Doe",
    email: "john@example.com",
    bio: "Photography enthusiast | Travel lover | Coffee addict",
    website: "https://example.com",
    avatar: "/placeholder.svg?height=150&width=150",
    followers: 1243,
    following: 567,
    posts: 128,
    isVerified: true,
  },
  {
    id: 2,
    username: "janedoe",
    name: "Jane Doe",
    email: "jane@example.com",
    bio: "Digital artist | Nature lover",
    website: "https://janedoe.com",
    avatar: "/placeholder.svg?height=150&width=150",
    followers: 2456,
    following: 321,
    posts: 95,
    isVerified: false,
  },
]

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  // login: async () => false,
  logout: () => {},
  loading: true,
  error: null,
  getUserByUsername: () => null,
  followUser: () => false,
  unfollowUser: () => false,
  isFollowing: () => false,
})

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [followingList, setFollowingList] = useState<number[]>([2]) // IDs of users being followed
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("heygram_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse stored user", e)
      }
    }
    setLoading(false)
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user && !pathname?.startsWith("/(auth)")) {
      if (pathname !== "/login" && pathname !== "/register") {
        // router.push("/login")
      }
    }
  }, [user, loading, pathname, router])

  const logout = (): void => {
    setUser(null)
    localStorage.removeItem("heygram_user")
    router.push("/login")
  }

  const getUserByUsername = (username: string): User | null => {
    return SAMPLE_USERS.find((u) => u.username === username) || null
  }

  const followUser = (userId: number): boolean => {
    if (!followingList.includes(userId)) {
      setFollowingList((prev) => [...prev, userId])
      return true
    }
    return false
  }

  const unfollowUser = (userId: number): boolean => {
    if (followingList.includes(userId)) {
      setFollowingList((prev) => prev.filter((id) => id !== userId))
      return true
    }
    return false
  }

  const isFollowing = (userId: number): boolean => {
    return followingList.includes(userId)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        logout,
        loading,
        error,
        getUserByUsername,
        followUser,
        unfollowUser,
        isFollowing,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

