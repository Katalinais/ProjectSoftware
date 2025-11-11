"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <h1 className="text-3xl font-semibold text-blue-700">
        Bienvenido al Sistema Judicial ⚖️
      </h1>
    </div>
  );
}