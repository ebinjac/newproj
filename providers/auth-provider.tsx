'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@/types/auth'
import Cookies from 'js-cookie'

interface AuthContextType {
  user: User | null
  login: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// For demo purposes, we'll use these test users
const TEST_USERS = {
  'user1@example.com': {
    username: 'user1',
    email: 'user1@example.com',
    groups: ['team1-prc', 'team2-prc']
  },
  'user2@example.com': {
    username: 'user2',
    email: 'user2@example.com',
    groups: ['team1-prc']
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if there's a stored auth token
    const storedEmail = Cookies.get('authEmail')
    if (storedEmail) {
      const user = TEST_USERS[storedEmail as keyof typeof TEST_USERS]
      if (user) {
        setUser(user)
      }
    }
  }, [])

  const login = (email: string) => {
    const user = TEST_USERS[email as keyof typeof TEST_USERS]
    if (user) {
      // Set both cookie and localStorage
      Cookies.set('authEmail', email, { path: '/' })
      localStorage.setItem('authEmail', email)
      setUser(user)
    }
  }

  const logout = () => {
    Cookies.remove('authEmail', { path: '/' })
    localStorage.removeItem('authEmail')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
