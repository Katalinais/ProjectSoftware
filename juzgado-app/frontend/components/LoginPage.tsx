"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/contexts/AppContext"

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
        const res = await fetch("http://localhost:4000/auth/login", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          // Usar el nombre del usuario del backend o el username
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Intentar autenticarse con el backend
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("token", data.token)
        // Usar el nombre del usuario del backend o el username
        login(data.user?.name || data.username || username)
      } else {
        setError(data.message || "Credenciales incorrectas")
      }
    } catch (err) {
      // Si el backend no está disponible, permitir login local
      console.warn("Backend no disponible, usando autenticación local:", err)
      if (username.trim()) {
        login(username)
      } else {
        setError("Por favor ingresa un usuario")
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Ingreso al Sistema Judicial
        </h1>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Usuario
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingresa tu usuario"
          className="border border-gray-300 rounded w-full mb-4 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          className="border border-gray-300 rounded w-full mb-4 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {error && (
          <p className="text-red-600 text-center text-sm mb-3">{error}</p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white rounded w-full py-2 hover:bg-blue-700 transition"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  )
}
