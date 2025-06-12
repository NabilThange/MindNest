import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>MindNest - Organize Your Learning Journey</title>
        <meta name="description" content="MindNest helps you organize your learning journey with smart study tools, progress tracking, and AI assistance. Built with bolt.new" />
        <meta name="keywords" content="learning, education, study, mindnest, AI assistant, progress tracking" />
        <meta name="author" content="MindNest Team" />
        <meta property="og:title" content="MindNest - Organize Your Learning Journey" />
        <meta property="og:description" content="Smart study tools and AI assistance for your learning journey" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MindNest - Organize Your Learning Journey" />
        <meta name="twitter:description" content="Smart study tools and AI assistance for your learning journey" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'MindNest - Built with bolt.new'
};