"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Producto = {
  id: number
  nombre: string
  precio: number
  stock: number
}

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  // Variables para el formulario
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  
  // NUEVO: Estado para saber si estamos editando y qué ID
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('prueba')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) console.error('Error al cargar:', error)
    else setProductos(data || [])
    
    setLoading(false)
  }

  // MODIFICADO: Ahora esta función sirve para Guardar o Actualizar
  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !precio || !stock) return alert('Por favor llena todos los campos')

    if (editingId) {
      // SI HAY UN ID, ESTAMOS EDITANDO (UPDATE)
      const { error } = await supabase
        .from('prueba')
        .update({ 
          nombre, 
          precio: parseFloat(precio), 
          stock: parseInt(stock) 
        })
        .eq('id', editingId) // Buscamos el producto exacto por su ID

      if (error) {
        console.error('Error al actualizar:', error)
        alert('Hubo un error al actualizar')
      }
    } else {
      // SI NO HAY ID, ESTAMOS CREANDO UNO NUEVO (INSERT)
      const { error } = await supabase
        .from('prueba')
        .insert([{ nombre, precio: parseFloat(precio), stock: parseInt(stock) }])

      if (error) {
        console.error('Error al insertar:', error)
        alert('Hubo un error al guardar')
      }
    }

    // Limpiamos todo al terminar
    cancelarEdicion()
    fetchProductos()
  }

  // NUEVO: Cargar los datos del producto en el formulario
  const iniciarEdicion = (producto: Producto) => {
    setNombre(producto.nombre)
    setPrecio(producto.precio.toString())
    setStock(producto.stock.toString())
    setEditingId(producto.id)
    // Hacemos scroll hacia arriba para que el usuario vea el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // NUEVO: Limpiar el formulario si nos arrepentimos de editar
  const cancelarEdicion = () => {
    setNombre('')
    setPrecio('')
    setStock('')
    setEditingId(null)
  }

  const eliminarProducto = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return

    const { error } = await supabase
      .from('prueba')
      .delete()
      .eq('id', id)

    if (error) console.error('Error al eliminar:', error)
    else fetchProductos()
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            NanoWare <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Gestión de inventario en tiempo real conectada a la nube</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Panel Izquierdo: Formulario */}
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-2xl shadow-sm border sticky top-8 transition-colors ${editingId ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
              
              <h2 className="text-xl font-bold mb-5 text-gray-800">
                {editingId ? '✏️ Editar Producto' : '📦 Nuevo Producto'}
              </h2>
              
              <form onSubmit={guardarProducto} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Nombre del producto</label>
                  <input 
                    type="text" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white" 
                    placeholder="Ej. Chocman" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Precio (S/)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={precio} 
                      onChange={(e) => setPrecio(e.target.value)} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white" 
                      placeholder="0.00" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Stock</label>
                    <input 
                      type="number" 
                      value={stock} 
                      onChange={(e) => setStock(e.target.value)} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white" 
                      placeholder="0" 
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    className={`w-full text-white font-bold py-3 rounded-lg transition-colors shadow-sm ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {editingId ? 'Actualizar Producto' : 'Guardar en Base de Datos'}
                  </button>
                  
                  {/* Botón de cancelar que solo aparece si estamos editando */}
                  {editingId && (
                    <button 
                      type="button"
                      onClick={cancelarEdicion}
                      className="w-full mt-2 text-gray-600 font-bold py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>

              </form>
            </div>
          </div>

          {/* Panel Derecho: Lista */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {productos.map((producto) => (
                  <div key={producto.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group relative">
                    
                    {/* Botones de acción */}
                    <div className="absolute top-4 right-4 flex gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Editar */}
                      <button 
                        onClick={() => iniciarEdicion(producto)} 
                        className="text-gray-300 hover:text-orange-500 cursor-pointer" 
                        title="Editar producto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      {/* Eliminar */}
                      <button 
                        onClick={() => eliminarProducto(producto.id)} 
                        className="text-gray-300 hover:text-red-500 cursor-pointer" 
                        title="Eliminar producto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1 pr-14 leading-tight">{producto.nombre}</h3>
                    <p className="text-xs text-gray-400 mb-4">ID de sistema: #{producto.id}</p>
                    
                    <div className="flex items-center gap-3">
                      <span className="bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1 rounded-md border border-gray-200">
                         {producto.stock} und.
                      </span>
                      <span className="bg-green-50 text-green-700 text-sm font-bold px-3 py-1 rounded-md border border-green-200">
                         S/ {producto.precio.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}