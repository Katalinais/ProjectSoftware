"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/personas", label: "Personas" },
        { href: "/procesos", label: "Procesos" },
        { href: "/actuaciones", label: "Actuaciones" },
        { href: "/reportes", label: "Reportes" },
    ];

    return (
        <nav className="bg-blue-700 text-white px-8 py-4 flex items-center justify-between shadow-md">
            <h1 className="text-2xl font-bold">Sistema Judicial</h1>

            <div className="flex gap-6">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`${pathname === link.href ? "text-yellow-300 font-semibold" : "text-white"
                            } hover:text-yellow-300 transition`}
                    >
                        {link.label}
                    </Link>
                ))}

                <button className="ml-6 bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition">
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
}
