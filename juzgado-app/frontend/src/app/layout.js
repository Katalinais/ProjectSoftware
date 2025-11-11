"use client";
import "./globals.css";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideNavbar = pathname === "/login";

  return (
    <html lang="es">
      <body className="bg-gray-100">
        {!hideNavbar && <Navbar />}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}