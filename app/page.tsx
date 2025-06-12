"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated()
      const user = authService.getCurrentUser()

      if (isAuthenticated && user) {
        // User is logged in, redirect to dashboard
        router.push("/dashboard")
      } else {
        // User is not logged in, redirect to landing
        router.push("/landing")
      }

      setIsChecking(false)
    }

    // Small delay to prevent flash
    setTimeout(checkAuth, 100)
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-yellow-500 border-4 border-black rotate-12 animate-pulse"></div>
            <div className="h-12 w-12 bg-blue-600 border-4 border-black -ml-6 -rotate-12 animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-black font-mono">STUDGEM</h1>
          <p className="font-bold font-mono">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}
