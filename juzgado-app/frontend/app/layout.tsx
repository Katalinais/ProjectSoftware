import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Gestión de Procesos Legales",
  description: "Interfaz profesional para la gestión de casos legales, procesos judiciales, personas y actuaciones",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logo.png",
        type: "image/png",
        sizes: "any",
      },
      {
        url: "/logo.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/logo.png",
        type: "image/png",
        sizes: "16x16",
      },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  )
}
