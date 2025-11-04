export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-blue-700">Ingreso al Sistema Judicial</h1>
            <form className="bg-white p-8 rounded-2xl shadow-md w-80">
                <label className="block mb-2 text-sm font-medium text-gray-700">Usuario</label>
                <input type="text" className="border border-gray-300 rounded w-full mb-4 p-2" />

                <label className="block mb-2 text-sm font-medium text-gray-700">Contraseña</label>
                <input type="password" className="border border-gray-300 rounded w-full mb-6 p-2" />

                <button className="bg-blue-600 text-white rounded w-full py-2 hover:bg-blue-700">
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}
