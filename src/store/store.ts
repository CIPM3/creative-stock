import { create } from 'zustand'
import { Cita, CitasMethod, Servicio, StoreCitas, StorePrecios, StoreProducts, StoreServicio, StoreStock } from '../types'
import { getCitas } from '@/api/citas/citas.get'
import { getProducts } from '@/api/productos/producto.get'
import { FakeDataProduct } from '@/data'
import { getStock } from '@/api/stock/stock.get'
import { getPrecios } from '@/api/precios/precios.get'
import { getServicios } from '@/api/servicios/servicios.get'


export const useCitasStore = create<StoreCitas>((set) => ({
  citas: [],
  selectedCita: null,
  citasMethod: CitasMethod.CREAR,
  cambiarCitasMethod: (nuevoMetodo: CitasMethod) => set({ citasMethod: nuevoMetodo }),
  cargarCitas: async () => {
    const data = await getCitas()
    set({ citas: data });
  },
  agregarCita: async (nuevaCita) => {
    set((state) => ({ citas: [...state.citas, nuevaCita] }));
  },
  eliminarCita: (id) => set((state) => {
    const nuevasCitas = state.citas.filter(cita => cita.id !== id);
    return { citas: nuevasCitas, selectedCita: null };
  }),
  seleccionarCita: (cita: Cita | null) => set({ selectedCita: cita }),
  actualizarCita: (actualizadaCita: Cita) => set((state) => {
    const nuevasCitas = state.citas.map(cita =>
      cita.id === actualizadaCita.id ? actualizadaCita : cita
    );
    return { citas: nuevasCitas, selectedCita: null };
  })
}))

export const useProductosStore = create<StoreProducts>((set) => ({
  productos: [],
  selectedFilter: null,
  selectedProduct: null,
  seleccionarFiltro: (categoria: string | null) => set({ selectedFilter: categoria }),
  searchInput: null,
  searchInputProduct: (search: string | null) => set({ searchInput: search }),
  agregarProduct: async (nuevoProducto) => {
    set((state) => ({ productos: [...state.productos, nuevoProducto] }));
  },
  // Agregar las funciones faltantes
  cargarProduct: async () => {
    // Verificar el entorno
    if (process.env.NODE_ENV === 'production') {
      // Lógica para producción
      const data = await getProducts();
      set({ productos: data });
    } else {// Aquí puedes definir datos de prueba o lógica alternativa
      const data = await getProducts();
      const fakeData = FakeDataProduct
      set({ productos: [...data, ...fakeData] });
    }
  }, // Implementar lógica más tarde
  eliminarProduct: (id) => set((state) => {
    const nuevosProductos = state.productos.filter(producto => producto.id !== id);
    return { productos: nuevosProductos };
  }), // Implementar lógica más tarde
  actualizarProduct: (actualizadoProducto) => set((state) => {
    const nuevosProductos = state.productos.map(producto =>
      producto.id === actualizadoProducto.id ? actualizadoProducto : producto
    );
    return { productos: nuevosProductos };
  }), // Implementar lógica más tarde
  selectProducto: (id: string) => {
    set((state) => {
      const producto = state.productos.find(producto => producto.id === id);
      return { ...state, selectedProduct: producto || null };
    });
  },
}))

export const useStockStore = create<StoreStock>((set) => ({
  stock: [],
  cargarStock: async () => {
    const data = await getStock()
    set({ stock: data })
  },
}))

export const usePreciosStore = create<StorePrecios>((set) => ({
  precios: [],
  cargarPrecios: async () => {
    const data = await getPrecios()
    set({ precios: data })
  }
}))

export const useServiciosStore = create<StoreServicio>((set,get) => ({
  servicio: [],
  cargarServicios: async () => {
    if (process.env.NODE_ENV === 'production') {
      // Lógica para producción
      const data = await getServicios();
      set({ servicio: [...data] });
    } else {// Aquí puedes definir datos de prueba o lógica alternativa
      const data = await getServicios();
      //const fakeData = FakeServiciosData
      set({ servicio: [...data] });
    }
  },
  agregarServicio: async (nuevoServicio: Servicio) => {
    set((state) => ({ servicio: [...state.servicio, nuevoServicio] }));
  },
  selectedFilter: null,
  seleccionarFiltro: (categoria: string | null) => set({ selectedFilter: categoria }),
  getServiciosByCita: (serviciosId: string[]): Servicio[] => {
    const servicios = get().servicio as Servicio[];

    // Verificar que 'state' y 'state.servicio' no sean undefined
    if (!Array.isArray(servicios)) {
      console.error('El estado de servicios no está definido o no es un array.');
      return [];
    }

    const serviciosIdSet = new Set(serviciosId);
    const serviciosEncontrados = servicios.filter(servicio => serviciosIdSet.has(servicio?.id!!));

    return serviciosEncontrados;
  },
}))