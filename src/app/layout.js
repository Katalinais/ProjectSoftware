import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Sistema Judicial",
  description: "Aplicación para gestión de procesos judiciales",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-100">
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
