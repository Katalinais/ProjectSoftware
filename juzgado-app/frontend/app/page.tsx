"use client"

import { useState, useEffect } from "react"
import { AppProvider, useApp } from "@/contexts/AppContext"
import LoginPage from "@/components/LoginPage"
import Dashboard from "@/components/Dashboard"

function AppContent() {
  const { isAuthenticated } = useApp()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <main className="min-h-screen bg-gray-50">{!isAuthenticated ? <LoginPage /> : <Dashboard />}</main>
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
