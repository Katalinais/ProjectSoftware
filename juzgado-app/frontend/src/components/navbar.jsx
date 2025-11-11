"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/people", label: "Personas" },
    { href: "/trials", label: "Procesos" },
    { href: "/actions", label: "Actuaciones" },
    { href: "/reports", label: "Reportes" },
  ];

  function handleLogout() {
    console.log("[Logout][react] handler called");
    try {
      localStorage.clear();
      console.log("[Logout] localStorage cleared");
      router.push("/login");
    } catch (err) {
      console.error("[Logout] error:", err);
    }
  }

  useEffect(() => {
    console.log("[Navbar] mounted, pathname=", pathname);
    const btn = document.getElementById("logout-btn");
    if (!btn) {
      console.log("[Navbar] logout button not found in DOM");
      return;
    }
    console.log("[Navbar] found logout button (fallback). attaching native listener");
    const nativeHandler = (e) => {
      console.log("[Logout][native] native handler invoked (fallback)");
      try {
        localStorage.clear();
        console.log("[Logout][native] cleared localStorage");
        window.location.href = "/login";
      } catch (err) {
        console.error("[Logout][native] err", err);
      }
    };
    btn.addEventListener("click", nativeHandler);
    btn.style.zIndex = "99999";
    btn.style.position = btn.style.position || "relative";
    btn.style.pointerEvents = "auto";

    return () => btn.removeEventListener("click", nativeHandler);
  }, [pathname]);

  return (
    <nav className="bg-blue-700 text-white px-8 py-4 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-bold">Sistema Judicial</h1>

      <div className="flex gap-6 items-center">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${pathname === link.href ? "text-yellow-300 font-semibold" : "text-white"} hover:text-yellow-300 transition`}
          >
            {link.label}
          </Link>
        ))}

        <button
          id="logout-btn"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            console.log("[Logout] onClick wrapper invoked");
            handleLogout();
          }}
          className="ml-6 bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition relative z-50 pointer-events-auto"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}