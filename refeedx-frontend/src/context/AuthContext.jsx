import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as authService from '../services/authService'
import { getToken, setToken, registerUnauthorizedHandler } from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // true only while we're checking a token we already had on page load
  const [initializing, setInitializing] = useState(true)

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  // If a 401 comes back from any API call, the token is no longer valid -
  // log out everywhere at once rather than making every screen handle it.
  useEffect(() => {
    registerUnauthorizedHandler(logout)
  }, [logout])

  // On first load, if a token is already sitting in localStorage from a
  // previous session, validate it against /auth/me before trusting it.
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setInitializing(false)
      return
    }

    authService
      .getCurrentUser()
      .then((data) => setUser(data))
      .catch(() => setToken(null))
      .finally(() => setInitializing(false))
  }, [])

  async function login(payload) {
    const data = await authService.login(payload)
    setToken(data.token)
    setUser({
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    })
    return data
  }

  async function register(payload) {
    const data = await authService.register(payload)
    setToken(data.token)
    setUser({
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    })
    return data
  }

  function updateUserInContext(partialUser) {
    setUser((prev) => (prev ? { ...prev, ...partialUser } : prev))
  }

  const value = {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    initializing,
    login,
    register,
    logout,
    updateUserInContext,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
