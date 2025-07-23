import { useState, useEffect } from "react";
import demonio from "./assets/demonio.jpg"; // Asegúrate de que esta imagen exista o usa una URL
import { ShoppingCart, X, CheckCircle, Info } from 'lucide-react'; // Importar iconos de Lucide React

// --- Datos de Productos (pueden venir de una API real) ---
const productos = [
    {
        id: 1,
        nombre: "demonio",
        precio: 399,
        // Se ha cambiado la importación local por una URL de placeholder para evitar errores de compilación
        // Si tienes la imagen "demonio.jpg" en "./assets/", puedes volver a usar: imagen: demonio,
        imagen: "demonio",
    },
    {
        id: 2,
        nombre: "Pasamontañas Sombra",
        precio: 349,
        imagen: "https://images.unsplash.com/photo-1604176354204-5ba8cd9985c3?auto=format&fit=crop&w=500&q=80",
    },
    {
        id: 3,
        nombre: "Pasamontañas Táctico",
        precio: 429,
        imagen: "https://images.unsplash.com/photo-1593784991073-87224d60daed?auto=format&fit=crop&w=500&q=80",
    },
    {
        id: 4,
        nombre: "Pasamontañas Urbano",
        precio: 380,
        imagen: "https://images.unsplash.com/photo-1587563177309-2041219b674b?auto=format&fit=crop&w=500&q=80",
    },
    {
        id: 5,
        nombre: "Pasamontañas Camuflaje",
        precio: 450,
        imagen: "https://images.unsplash.com/photo-1549495473-b77051a84f47?auto=format&fit=crop&w=500&q=80",
    },
    {
        id: 6,
        nombre: "Pasamontañas Clásico",
        precio: 320,
        imagen: "https://images.unsplash.com/photo-1562208031-6923b7e7e2d1?auto=format&fit=crop&w=500&q=80",
    },
];

// --- Componente de Notificación Personalizado ---
const NotificationModal = ({ message, type, onClose }) => {
    if (!message) return null;

    const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
    const Icon = type === "success" ? CheckCircle : Info; // Usar Info para errores/advertencias

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className={`relative ${bgColor} text-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center transform transition-all duration-300 scale-100 opacity-100`}>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors"
                >
                    <X size={24} />
                </button>
                <div className="flex flex-col items-center justify-center mb-4">
                    <Icon size={48} className="mb-2" />
                    <p className="text-lg font-semibold">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                    Entendido
                </button>
            </div>
        </div>
    );
};

// --- Componente del Carrito de Compras ---
const ShoppingCartModal = ({
    carrito,
    eliminarDelCarrito,
    vaciarCarrito,
    obtenerTotal,
    finalizarCompra,
    onClose,
    showNotification
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40 p-4">
            <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-2xl max-w-md w-full relative border border-zinc-700 transform transition-all duration-300 scale-100 opacity-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">
                    🛒 Tu Carrito ({carrito.length})
                </h2>

                {carrito.length === 0 ? (
                    <p className="text-center text-gray-400 text-lg py-8">
                        Tu carrito está vacío. ¡Agrega algunos pasamontañas!
                    </p>
                ) : (
                    <>
                        <ul className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {carrito.map((item, index) => (
                                <li
                                    key={`${item.id}-${index}`} // Usar id y index para una key más única
                                    className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg shadow-inner border border-zinc-700"
                                >
                                    <span className="text-lg font-medium text-gray-200 flex-grow">
                                        {item.nombre}
                                    </span>
                                    <span className="font-semibold text-green-400 ml-4">
                                        ${item.precio} MXN
                                    </span>
                                    <button
                                        className="ml-4 text-red-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-zinc-700"
                                        onClick={() => eliminarDelCarrito(index)}
                                        aria-label={`Eliminar ${item.nombre} del carrito`}
                                    >
                                        <X size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-zinc-700 pt-4 mt-4">
                            <div className="flex justify-between items-center text-2xl font-bold mb-4">
                                <span>Total:</span>
                                <span className="text-green-400">${obtenerTotal()} MXN</span>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <button
                                    className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-600/30"
                                    onClick={() => {
                                        vaciarCarrito();
                                        showNotification("Carrito vaciado.", "error"); // Usar error para vaciar
                                    }}
                                    disabled={carrito.length === 0}
                                >
                                    Vaciar Carrito
                                </button>
                                <button
                                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/30"
                                    onClick={() => {
                                        finalizarCompra();
                                        onClose(); // Cerrar el modal después de finalizar
                                    }}
                                >
                                    Finalizar Compra
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// --- Componente Principal de la Aplicación ---
function App() {
    // Estado del carrito, cargado desde localStorage
    const [carrito, setCarrito] = useState(() => {
        const guardado = localStorage.getItem("carrito");
        return guardado ? JSON.parse(guardado) : [];
    });

    // Estado para controlar la visibilidad del modal del carrito
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

    // Estado para la notificación personalizada
    const [notification, setNotification] = useState({ message: "", type: "" });

    // Efecto para guardar el carrito en localStorage cada vez que cambia
    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    // Función para mostrar la notificación
    const showNotification = (message, type) => {
        setNotification({ message, type });
        // Opcional: ocultar la notificación automáticamente después de un tiempo
        // setTimeout(() => setNotification({ message: "", type: "" }), 3000);
    };

    // Funciones del Carrito
    const agregarAlCarrito = (producto) => {
        setCarrito([...carrito, producto]);
        showNotification(`${producto.nombre} agregado al carrito.`, "success");
    };

    const obtenerTotal = () => {
        return carrito.reduce((total, item) => total + item.precio, 0);
    };

    const eliminarDelCarrito = (indexAEliminar) => {
        const nuevoCarrito = carrito.filter((_, index) => index !== indexAEliminar);
        setCarrito(nuevoCarrito);
        showNotification("Producto eliminado del carrito.", "error"); // Usar error para eliminar
    };

    const vaciarCarrito = () => {
        setCarrito([]);
    };

    const finalizarCompra = () => {
        if (carrito.length === 0) {
            showNotification("No tienes productos en el carrito.", "error");
            return;
        }

        showNotification(
            "✅ ¡Gracias por tu compra! Recibirás un correo con la información de envío.",
            "success"
        );
        setCarrito([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-black text-white p-6 font-inter relative">
            {/* Ícono de Carrito Flotante */}
            <button
                className="fixed top-6 right-6 bg-zinc-800 text-green-400 p-4 rounded-full shadow-xl hover:scale-110 transition-transform duration-300 z-30 border border-zinc-700 flex items-center justify-center"
                onClick={() => setIsCartModalOpen(true)}
                aria-label={`Abrir carrito, tienes ${carrito.length} productos`}
            >
                <ShoppingCart size={28} />
                {carrito.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce-custom">
                        {carrito.length}
                    </span>
                )}
            </button>

            {/* Título Principal */}
            <h1 className="text-5xl font-extrabold text-center mb-12 mt-8 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600">
                Catálogo de Pasamontañas
            </h1>

            {/* 🎨 Sección de Productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto pb-16">
                {productos.map((producto) => (
                    <div
                        key={producto.id}
                        className="bg-zinc-900 rounded-3xl shadow-xl shadow-black/50 p-6 flex flex-col items-center border border-zinc-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 group"
                    >
                        <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
                            <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                                onError={(e) => {
                                    e.target.onerror = null; // Evita bucles infinitos
                                    e.target.src = `https://placehold.co/500x300/333333/FFFFFF?text=Imagen+no+disponible`;
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                                <p className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    ${producto.precio} MXN
                                </p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-3 text-center text-gray-100 leading-tight">
                            {producto.nombre}
                        </h2>
                        <p className="text-green-400 font-extrabold text-2xl mb-6">
                            ${producto.precio} MXN
                        </p>
                        <button
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/40 hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                            onClick={() => agregarAlCarrito(producto)}
                        >
                            Agregar al Carrito
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal del Carrito */}
            {isCartModalOpen && (
                <ShoppingCartModal
                    carrito={carrito}
                    eliminarDelCarrito={eliminarDelCarrito}
                    vaciarCarrito={vaciarCarrito}
                    obtenerTotal={obtenerTotal}
                    finalizarCompra={finalizarCompra}
                    onClose={() => setIsCartModalOpen(false)}
                    showNotification={showNotification}
                />
            )}

            {/* Modal de Notificación */}
            <NotificationModal
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "", type: "" })}
            />

            {/* Estilos CSS personalizados para el scrollbar y la animación de rebote */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

                body {
                    font-family: 'Inter', sans-serif;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #27272a; /* zinc-800 */
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #52525b; /* zinc-600 */
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #71717a; /* zinc-500 */
                }

                @keyframes bounce-custom {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }

                .animate-bounce-custom {
                    animation: bounce-custom 1s infinite;
                }
            `}</style>
        </div>
    );
}

export default App;