"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
}

interface Proceso {
  id: string
  numero: string
  tipo: "Ordinario" | "Tutela" | "Habeas corpus" | "Incidente de desacato"
  fecha: string
  descripcion?: string
}

interface Persona {
  id: string
  nombre: string
  cedula: string
  rol: string
  email?: string
  telefono?: string
}

interface Actuacion {
  id: string
  procesoId: string
  fecha: string
  tipo: string
  descripcion: string
}

interface DescripcionActuacion {
  id: string
  nombre: string
  descripcion: string
}

interface AppContextType {
  isAuthenticated: boolean
  user: User | null
  procesos: Proceso[]
  personas: Persona[]
  actuaciones: Actuacion[]
  descripciones: DescripcionActuacion[]
  login: (name: string) => void
  logout: () => void
  addProceso: (proceso: Omit<Proceso, "id">) => void
  deleteProceso: (id: string) => void
  addPersona: (persona: Omit<Persona, "id">) => void
  deletePersona: (id: string) => void
  addActuacion: (actuacion: Omit<Actuacion, "id">) => void
  deleteActuacion: (id: string) => void
  addDescripcion: (descripcion: Omit<DescripcionActuacion, "id">) => void
  deleteDescripcion: (id: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const STORAGE_KEY = "legal_management_app"

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [procesos, setProcesos] = useState<Proceso[]>([])
  const [personas, setPersonas] = useState<Persona[]>([])
  const [actuaciones, setActuaciones] = useState<Actuacion[]>([])
  const [descripciones, setDescripciones] = useState<DescripcionActuacion[]>([])

  // Cargar datos del localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setProcesos(data.procesos || [])
        setPersonas(data.personas || [])
        setActuaciones(data.actuaciones || [])
        setDescripciones(data.descripciones || [])
        if (data.user) {
          setUser(data.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }
  }, [])

  // Guardar datos en localStorage
  useEffect(() => {
    const data = {
      user,
      procesos,
      personas,
      actuaciones,
      descripciones,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [user, procesos, personas, actuaciones, descripciones])

  const login = (name: string) => {
    const newUser = {
      id: Date.now().toString(),
      name,
    }
    setUser(newUser)
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  const addProceso = (proceso: Omit<Proceso, "id">) => {
    const newProceso = { ...proceso, id: Date.now().toString() }
    setProcesos([...procesos, newProceso])
  }

  const deleteProceso = (id: string) => {
    setProcesos(procesos.filter((p) => p.id !== id))
    setActuaciones(actuaciones.filter((a) => a.procesoId !== id))
  }

  const addPersona = (persona: Omit<Persona, "id">) => {
    const newPersona = { ...persona, id: Date.now().toString() }
    setPersonas([...personas, newPersona])
  }

  const deletePersona = (id: string) => {
    setPersonas(personas.filter((p) => p.id !== id))
  }

  const addActuacion = (actuacion: Omit<Actuacion, "id">) => {
    const newActuacion = { ...actuacion, id: Date.now().toString() }
    setActuaciones([...actuaciones, newActuacion])
  }

  const deleteActuacion = (id: string) => {
    setActuaciones(actuaciones.filter((a) => a.id !== id))
  }

  const addDescripcion = (descripcion: Omit<DescripcionActuacion, "id">) => {
    const newDescripcion = { ...descripcion, id: Date.now().toString() }
    setDescripciones([...descripciones, newDescripcion])
  }

  const deleteDescripcion = (id: string) => {
    setDescripciones(descripciones.filter((d) => d.id !== id))
  }

  const value: AppContextType = {
    isAuthenticated,
    user,
    procesos,
    personas,
    actuaciones,
    descripciones,
    login,
    logout,
    addProceso,
    deleteProceso,
    addPersona,
    deletePersona,
    addActuacion,
    deleteActuacion,
    addDescripcion,
    deleteDescripcion,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
