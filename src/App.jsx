import "./index.css";
import demonio from "./assets/demonio.jpg";
import { useState, useEffect } from "react";

const productos = [
	{
		id: 1,
		nombre: "Pasamontañas Demonio",
		precio: 399,
		imagen: demonio,
	},
	{
		id: 2,
		nombre: "Pasamontañas Sombra",
		precio: 349,
		imagen:
			"https://images.unsplash.com/photo-1604176354204-5ba8cd9985c3?auto=format&fit=crop&w=500&q=80",
	},
	{
		id: 3,
		nombre: "Pasamontañas Táctico",
		precio: 429,
		imagen:
			"https://images.unsplash.com/photo-1593784991073-87224d60daed?auto=format&fit=crop&w=500&q=80",
	},
];

function App() {
	const [carrito, setCarrito] = useState(() => {
		const guardado = localStorage.getItem("carrito");
		return guardado ? JSON.parse(guardado) : [];
	});

	useEffect(() => {
		localStorage.setItem("carrito", JSON.stringify(carrito));
	}, [carrito]);

	const agregarAlCarrito = (producto) => {
		setCarrito([...carrito, producto]);
	};
	const obtenerTotal = () => {
		return carrito.reduce((total, item) => total + item.precio, 0);
	};
	const eliminarDelCarrito = (indexAEliminar) => {
		const nuevoCarrito = carrito.filter((_, index) => index !== indexAEliminar);
		setCarrito(nuevoCarrito);
	};
	const vaciarCarrito = () => {
		setCarrito([]);
	};
	const finalizarCompra = () => {
		if (carrito.length === 0) {
			alert("No tienes productos en el carrito.");
			return;
		}

		alert(
			"✅ ¡Gracias por tu compra! Recibirás un correo con la información de envío."
		);
		setCarrito([]);
	};

	return (
		<div className="min-h-screen bg-zinc-900 text-white p-6">
			<h1 className="text-4xl font-bold text-center mb-10">
				Catálogo de Pasamontañas
			</h1>

			{/* 🛒 Carrito */}
			<div className="bg-white text-black p-4 rounded-xl mb-8 max-w-2xl mx-auto">
				<h2 className="text-2xl font-bold mb-2">
					🛒 Carrito ({carrito.length})
				</h2>
				<button
					className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition mb-4"
					onClick={vaciarCarrito}
					disabled={carrito.length === 0}
				>
					Vaciar carrito
				</button>
				{carrito.length === 0 ? (
					<p>No has agregado nada aún.</p>
				) : (
					<ul className="space-y-2">
						{carrito.map((item, index) => (
							<li key={index} className="flex justify-between border-b pb-1">
								<button
									className="text-red-500 hover:text-red-700"
									onClick={() => eliminarDelCarrito(index)}
								>
									Eliminar
								</button>
								<span>{item.nombre}</span>
								<span className="font-semibold">${item.precio}</span>
							</li>
						))}
						<li className="flex justify-between pt-2 font-bold text-lg border-t mt-2">
							Total: ${obtenerTotal()} MXN
						</li>
						<li className="pt-2 flex justify-end">
							<button
								className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
								onClick={finalizarCompra}
							>
								Finalizar compra
							</button>
						</li>
					</ul>
				)}
			</div>

			{/* 🎨 Productos */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
				{productos.map((producto) => (
					<div
						key={producto.id}
						className="bg-zinc-800 rounded-2xl shadow-lg p-4 hover:scale-105 transition-transform max-w-xs mx-auto"
					>
						<img
							src={producto.imagen}
							alt={producto.nombre}
							className="rounded-xl mb-4 w-64 h-40 object-cover mx-auto"
						/>
						<h2 className="text-2xl font-semibold mb-2">
							{producto.nombre}
						</h2>
						<p className="text-green-400 font-bold mb-4">
							${producto.precio} MXN
						</p>
						<button
							className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
							onClick={() => agregarAlCarrito(producto)}
						>
							Agregar al carrito
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
