"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { authService, type AuthState } from "@/lib/auth"

const AuthContext = createContext<{
  authState: AuthState
  login: (prn: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (signupData: any) => Promise<{ success: boolean; error?: string }>
  logout: () => void
} | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    // Check for existing auth on mount
    const checkAuth = () => {
      try {
        const user = authService.getCurrentUser()
        const isAuthenticated = authService.isAuthenticated()

        setAuthState({
          isAuthenticated,
          user,
          isLoading: false,
        })
      } catch (error) {
        console.error("Auth check error:", error)
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        })
      }
    }

    // Small delay to prevent flash
    setTimeout(checkAuth, 100)
  }, [])

  const login = async (prn: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      const result = await authService.login(prn, password)

      if (result.success && result.user) {
        setAuthState({
          isAuthenticated: true,
          user: result.user,
          isLoading: false,
        })
        return { success: true }
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }))
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error("Login hook error:", error)
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const signup = async (signupData: any) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      const result = await authService.signup(signupData)

      if (result.success && result.user) {
        setAuthState({
          isAuthenticated: true,
          user: result.user,
          isLoading: false,
        })
        return { success: true }
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }))
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error("Signup hook error:", error)
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const logout = () => {
    try {
      authService.logout()
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      })
    } catch (error) {
      console.error("Logout hook error:", error)
      // Still clear state even if logout fails
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      })
    }
  }

  return <AuthContext.Provider value={{ authState, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
