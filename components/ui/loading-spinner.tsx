"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "border-4 border-black border-t-transparent animate-spin",
        sizeClasses[size]
      )}></div>
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-yellow-500 border-4 border-black rotate-12 animate-pulse"></div>
          <div className="h-12 w-12 bg-blue-600 border-4 border-black -ml-6 -rotate-12 animate-pulse"></div>
        </div>
        <h1 className="text-2xl font-black font-mono">MINDNEST</h1>
        <p className="font-bold font-mono">Loading...</p>
        <LoadingSpinner className="mt-4" />
      </div>
    </div>
  )
}