import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import mockData from '../data/MockData.json';
//IMPORTAR LAS CLASES
import { Contenedor } from '../domain/carga/Contenedor';
import { Item } from '../domain/carga/Item';

const GestorCarga: React.FC = () => {

  // Estado para guardar el 'id' del ítem que está expandido
  const [itemExpandido, setItemExpandido] = useState<string | null>(null);
  
  const contenedorPrincipal = useRef(new Contenedor("CONT-001", "Pallet"));

  // Estado en el que se inicializa con la capacidad máxima (en este caso 50 kg)
  const [capacidadRestante, setCapacidadRestante] = useState<number>(50);

  // Arreglo que guardará los objetos de los ítems a medida que se vayan agregando
  const [listaItems, setListaItems] = useState<any[]>([]);

  // Función para abrir/cerrar la lista
  const toggleItem = (id: string) => {
    setItemExpandido(itemExpandido === id ? null : id);
  };

  // Función que une JSON con Dominio
  const handleAgregarAlContenedor = (itemJson: any) => {

    // VALIDACIÓN (Verifica que no se exceda del peso máximo)
    if (itemJson.pesoKg > capacidadRestante) {
      alert(`¡El ítem es muy pesado! Solo queda ${capacidadRestante.toFixed(2)}kg de capacidad.`);
      return; // Corta la ejecución
    }
    
    // Crea el Item con el constructor 
    const nuevoItem = new Item(
      itemJson.id, 
      itemJson.descripcion, 
      itemJson.pesoKg
    );

    // Agrega el ítem actual al estado para que aparezca en la tabla
    setListaItems([...listaItems, {
      id: itemJson.id,
      tipo: itemJson.tipo,
      volumen: "x m/3", 
      precioBase: 0, 
      costoAdicional: 0,
      total: 0
    }]);

    // Usa el método "agregarComponente()" en clase "Contenedor" para agregar al arreglo
    contenedorPrincipal.current.agregarComponente(nuevoItem);

    // Calcula la nueva capacidad
    const pesoRestante = capacidadRestante - itemJson.pesoKg;

    // Actualiza la capacidad restante
    setCapacidadRestante(pesoRestante);
    
    console.log(`Ítem agregado. Capacidad restante: ${pesoRestante}kg`);
  };

  return (
    <Layout>
      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-white w-full h-full min-h-screen flex flex-col text-gray-800">

        {/* CONTENEDOR SUPERIOR: TÍTULO */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold uppercase tracking-wide">
            Crear Carga
          </h1>
        </div>

        {/* CONTENEDOR INFERIOR */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12">

          {/* LADO IZQUIERDO  */}
          <div className="lg:col-span-5 border-r border-gray-200 flex flex-col h-full">
            
            {/* Mitad superior izquierda: Selectores */}
            <div className="p-6 pb-2">
              {/* SELECTOR 1: CENTRO DE DISTRIBUCIÓN SALIDA */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-bold text-gray-800 text-sm">
                  Centro de distribución - Salida
                </label>
                <select 
                  className="w-full bg-white border border-gray-200 text-gray-800 py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
                  defaultValue="pto-montt"
                >
                  <option value="" disabled>Seleccione un centro...</option>
                  <option value="pto-montt">Centro - Pto. Montt</option>
                  <option value="castro">Centro - Castro</option>
                  <option value="osorno">Centro - Osorno</option>
                </select>
              </div>

              {/* SELECTOR 2: CENTRO DE DISTRIBUCIÓN DESTINO */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-bold text-gray-800 text-sm">
                  Centro de distribución - Destino
                </label>
                <select 
                  className="w-full bg-white border border-gray-200 text-gray-800 py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
                  defaultValue="castro"
                >
                  <option value="" disabled>Seleccione un centro...</option>
                  <option value="pto-montt">Centro - Pto. Montt</option>
                  <option value="castro">Centro - Castro</option>
                  <option value="osorno">Centro - Osorno</option>
                </select>
              </div>

              {/* SELECTOR 3: TIPO DE CONTENEDOR */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-bold text-gray-800 text-sm">
                  Tipo de contenedor
                </label>
                <select 
                  className="w-full bg-white border border-gray-200 text-gray-800 py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
                  defaultValue="pallet"
                >
                  <option value="" disabled>Seleccione un centro...</option>
                  <option value="pallet">Pallet</option>
                  <option value="caja">Caja</option>
                </select>
              </div>
            </div>

            {/* Mitad inferior izquierda: Ítems */}
            <div className="px-6 pb-6 flex-grow flex flex-col overflow-hidden">
              <h3 className="font-bold text-gray-800 text-sm mb-2">Items</h3>
              
              {/* SI LA CANTIDAD DE ITEMS SOBREPASA EL TAMAÑO DE LA CAJA, HABILITA LA BARRA DE DESPLAZAMIENTO */}
              <div className="flex-grow overflow-y-auto pr-1">
                
                {/* CAJA CONTENEDORA */}
                <div className="border border-gray-200 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex flex-col gap-2">
                    
                    {/* RECORRE EL ARCHIVO MOCKDATA */}
                    {mockData.item.map((item) => (
                      <div key={item.id} className="flex flex-col">
                        
                        {/* BOTÓN PRINCIPAL CON LA DESCRIPCIÓN DEL ÍTEM */}
                        <button 
                          onClick={() => toggleItem(item.id)}
                          className="text-left font-bold text-gray-800 bg-gray-50 hover:bg-gray-100 p-3 rounded-md transition border border-gray-200 flex justify-between items-center"
                        >
                          {item.descripcion}
                          <span className="text-xl text-gray-500 font-normal">
                            {itemExpandido === item.id ? '-' : '+'}
                          </span>
                        </button>

                        {/* DETALLES QUE SE ABREN AL SELECCIONAR */}
                        {itemExpandido === item.id && (
                          <div className="border-t-2 border-b-2 border-black py-4 mt-2 px-2 animate-fade-in">
                            
                            {/* TIPO Y PESO DEL JSON */}
                            <div className="flex gap-4 mb-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                              <p>Tipo: <span className="text-gray-800">{item.tipo}</span></p>
                              <p>Peso: <span className="text-gray-800">{item.pesoKg} kg</span></p>
                            </div>

                            {/* SECCIÓN DE OPCIONES: COSTOS ADICIONALES */}
                            <div className="mb-5 pl-2">
                              <p className="font-bold text-sm text-gray-800 mb-2">Costo adicional</p>
                              
                              <div className="flex flex-col gap-1.5 w-3/4">
                                <label className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-3 py-1 rounded text-sm text-gray-700 flex items-center gap-2 transition">
                                  <input type="checkbox" className="accent-pink-500 w-3.5 h-3.5" />
                                  Seguro
                                </label>
                                <label className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-3 py-1 rounded text-sm text-gray-700 flex items-center gap-2 transition">
                                  <input type="checkbox" className="accent-pink-500 w-3.5 h-3.5" />
                                  Manejo Frágil
                                </label>
                                <label className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-3 py-1 rounded text-sm text-gray-700 flex items-center gap-2 transition">
                                  <input type="checkbox" className="accent-pink-500 w-3.5 h-3.5" />
                                  Impuesto Territorial
                                </label>
                              </div>
                            </div>

                            {/* BOTÓN "AGREGAR" */}
                            <div className="flex justify-center mt-2">
                              <button 
                                onClick={() => handleAgregarAlContenedor(item)}
                                className="border border-black text-black font-bold text-xs py-1.5 px-6 rounded-md uppercase tracking-wide hover:bg-gray-100 transition"
                                >
                                Agregar
                              </button>
                            </div>
                            
                          </div>
                        )}
                        
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* LADO DERECHO */}
          <div className="lg:col-span-7 p-6 flex flex-col self-start">

            {/* TABLA CON EL CONTENIDO */}
            <div className="bg-[#FFAEC1] p-5 rounded-xl flex-grow min-h-[350px] flex flex-col mb-6">
              
              {/* ENCABEZADO DE LA TABLA: Títulos de las columnas */}
              <div className="grid grid-cols-6 gap-2 bg-white/40 p-2.5 rounded-lg text-center font-bold text-gray-700 text-xs mb-3 shadow-sm uppercase tracking-wider">
                <div>Código</div>
                <div>Tipo</div>
                <div>Volumen</div>
                <div>Precio B.</div>
                <div>Costo A.</div>
                <div>Total</div>
              </div>

              {/* CUERPO DE LA TABLA: Contenedor con scroll para las filas */}
              <div className="flex-grow space-y-2 overflow-y-auto max-h-[280px] pr-1">
                {listaItems.length === 0 ? (
                  // Mensaje que se muestra si todavía no se agregan ítems
                  <div className="bg-white/70 h-full min-h-[200px] border-2 border-dashed border-pink-300 rounded-lg flex items-center justify-center text-gray-500 text-sm italic p-4 text-center">
                    El contenedor está vacío. <br /> Agrega ítems desde el panel izquierdo.
                  </div>
                ) : (
                  // UN SOLO BLOQUE BLANCO para contener todas las filas unificadas
                  <div className="bg-white/90 flex-grow min-h-[220px] rounded-lg p-2 shadow-sm divide-y divide-gray-100">
                    {listaItems.map((item, index) => (
                      <div 
                        key={item.id + "-" + index} 
                        className="grid grid-cols-6 gap-2 py-3 text-center text-gray-600 text-xs items-center hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="font-bold text-gray-800">{item.id}</div>
                        <div className="font-bold text-gray-800">{item.tipo}</div>
                        <div className="font-bold text-gray-800">{item.volumen}</div>
                        <div className="font-bold text-gray-800">${item.precioBase}</div>
                        <div className="font-bold text-gray-800">${item.costoAdicional}</div>
                        <div className="font-bold text-gray-800">${item.total}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Zona Inferior: Capacidad y Botón Guardar */}
            <div className="h-32 flex flex-col justify-between items-start">
            
            {/* Visualización del peso */}
            <h3 className="font-bold text-gray-800 text-sm mb-2">Capacidad restante</h3>
            <div className="w-40 border border-gray-200 bg-[#FFAEC1] shadow-sm h-12 rounded-lg flex flex-col items-center justify-center text-gray-800">
              <span className="text-xl font-black text-white">
                  {capacidadRestante.toFixed(2)} kg
                </span>
            </div>
            
            {/* Botón Guardar */}
            <div className="w-full flex justify-center mt-4">
              <button className="bg-[#FFAEC1] text-white py-1 px-8 rounded-lg font-bold uppercase tracking-widest shadow hover:bg-[#FF86B5] transition-colors">
                Guardar
              </button>
            </div>

          </div>
        

          </div>

        </div>

      </div>
    </Layout>
  );
};

export default GestorCarga;