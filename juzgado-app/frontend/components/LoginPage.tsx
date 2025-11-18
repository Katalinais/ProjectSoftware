"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/contexts/AppContext"
import { API_URL } from "@/lib/config"

export default function LoginPage() {
  const { login } = useApp()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()

          login(data.user?.name || data.username || "Usuario")
        } else {
          localStorage.removeItem("token")
        }
      } catch (err) {
        console.error("Error verificando token:", err)
        localStorage.removeItem("token")
      }
    }
    verifyToken()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("token", data.token)
        login(data.user?.name || data.username || username)
      } else {
        setError(data.message || "Credenciales incorrectas")
      }
    } catch (err) {
      console.warn("Backend no disponible, usando autenticación local:", err)
      if (username.trim()) {
        login(username)
      } else {
        setError("Por favor ingresa un usuario")
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100"
        >
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="h-32 w-auto object-contain mb-6 drop-shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/icon.svg"
              }}
            />
            <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
              Sistema Judicial
            </h1>
            <p className="text-slate-600 text-sm text-center">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
