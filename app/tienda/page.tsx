"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Producto = {
  id: number
  nombre: string
  precio: number
  stock: number
  imagen: string
}

export default function Tienda() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('prueba')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) console.error('Error al cargar:', error)
    else setProductos(data || [])
    
    setLoading(false)
  }

  // Función simulada para el botón de compra
  const manejarCompra = (nombre: string) => {
    alert(`🛒 ¡Añadiste "${nombre}" a tu carrito!`)
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      
      {/* Navegación Superior (Estilo Industrial Oscuro) */}
      <nav className="bg-slate-900 text-white shadow-xl py-5 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h1 className="text-2xl font-black tracking-tight">
            Metrito <span className="text-amber-500">Industrial</span>
          </h1>
        </div>
        
        <a href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="hidden sm:inline">Panel de Control</span>
        </a>
      </nav>

      {/* Hero Banner */}
      <div className="bg-slate-800 text-white py-12 px-6 mb-12 shadow-inner">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Equipamiento de <span className="text-amber-500">Alto Rendimiento</span></h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl">Catálogo especializado en maquinaria, repuestos y herramientas industriales. Calidad garantizada para tus proyectos más exigentes.</p>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="max-w-7xl mx-auto px-6">
        
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-amber-500"></div>
            <p className="text-slate-500 font-semibold animate-pulse">Cargando inventario...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {productos.map((producto) => (
              <div 
                key={producto.id} 
                className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                
                {/* Contenedor de Imagen con Etiqueta Flotante */}
                <div className="relative h-60 bg-slate-100 overflow-hidden">
                  {/* Etiqueta de Stock flotante */}
                  <div className="absolute top-3 left-3 z-10">
                    {producto.stock > 0 ? (
                      <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 backdrop-blur-sm bg-opacity-90">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        En Stock ({producto.stock})
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                        Agotado
                      </span>
                    )}
                  </div>

                  {producto.imagen ? (
                    <img 
                      src={producto.imagen} 
                      alt={producto.nombre} 
                      className={`w-full h-full object-cover transition-transform duration-700 ${producto.stock > 0 ? 'group-hover:scale-110' : 'grayscale opacity-70'}`}
                    />
                  ) : (
                    <div className="w-full h-full flex justify-center items-center text-6xl">🔧</div>
                  )}
                </div>

                {/* Información del Producto */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight line-clamp-2 min-h-[3rem]">
                    {producto.nombre}
                  </h3>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-end justify-between mb-5">
                      <span className="text-sm font-semibold text-slate-400 mb-1">Precio Neto</span>
                      <p className="text-1xl font-black text-slate-900">
                        S/ {producto.precio.toFixed(2)}
                      </p>
                    </div>

                    {/* Botón de Comprar Interactivo */}
                    {producto.stock > 0 ? (
                      <button 
                        onClick={() => manejarCompra(producto.nombre)}
                        className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-900 font-extrabold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Añadir al Carrito
                      </button>
                    ) : (
                      <button disabled className="w-full bg-slate-100 text-slate-400 font-bold py-3.5 rounded-xl cursor-not-allowed border border-slate-200">
                        Temporalmente sin stock
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}