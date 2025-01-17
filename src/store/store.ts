import { create } from 'zustand'
import { Cita, CitasMethod, FacturaDetalleItem, StoreCitas, StorePrecios, StoreProducts, StoreServicio, StoreStock } from '../types'
import { getCitas } from '@/api/citas/citas.get'
import { getProducts } from '@/api/productos/producto.get'
import { FakeDataProduct } from '@/data'
import { getStock } from '@/api/stock/stock.get'
import { getPrecios } from '@/api/precios/precios.get'
import { getServicios } from '@/api/servicios/servicios.get'
import { StorePOV, Servicio } from '../types/index';
import { nanoid } from 'nanoid';
import { GET_FACTURAS_DB } from '@/api/facturas/facturas.get'


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

export const useServiciosStore = create<StoreServicio>((set, get) => ({
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
  getServicioById: (id: string): Servicio | null => {
    const servicios = get().servicio as Servicio[]

    return servicios.find((servicio) => servicio.id === id) || null;
  }
}))

export const usePOVStore = create<StorePOV>((set) => ({
  servicioPOV: [],
  productosPOV: [],
  selectedAgendado: null,
  // Iniciamos factura con datos vacíos (y un id generado)
  facturas: [],
  factura: {
    id: nanoid(),
    serviciosIds: [],
    total: 16,
    impuestoPorcentaje: 0,
    tipoPago: 'efectivo',
    idCita: '', // o quítalo si ya no lo usas
  },
  cargarFacturas: async () => {
    const data = await GET_FACTURAS_DB();
      //const fakeData = FakeServiciosData
      set({ facturas: [...data] });
  },
  agregarServiciosAPov: (servicios) => set(() => ({ servicioPOV: servicios })),
  agregarProductosAPov: (productos) => set(() => ({ productosPOV: productos })),
  seleccionarAgendado: (cita) => set(() => ({ selectedAgendado: cita })),
  // Crea una nueva factura (si la quieres crear en algún momento)
  agregarAFactura: (item) => set(() => ({ factura: item })),
  // Actualiza campos de la factura actual
  actualizarFactura: (cambios) => set((state) => ({
    factura: { ...state.factura, ...cambios },
  })),
  // Limpia la factura (reinicia a valores por defecto)
  limpiarFactura: () => set(() => ({
    factura: {
      // Si deseas regenerar un nuevo id automáticamente:
      id: nanoid(),
      serviciosIds: [],
      total: 0,
      impuestoPorcentaje: 16,
      tipoPago: "efectivo",
      idCita: ""
    },
  })),
  // Elimina un servicio (detalle) de la factura
  eliminarServicioFactura: (servicioId) =>
    set((state) => {
      const updatedDetalles = state.factura.serviciosIds.filter(
        (detalle) => detalle.id !== servicioId
      );
      const newPrecio = updatedDetalles.reduce((acc, d) => acc + d.total, 0);
      return {
        factura: {
          ...state.factura,
          serviciosIds: updatedDetalles,
          precio: newPrecio,
        },
      };
    }),
  // Actualiza el impuesto de la factura
  actualizarImpuestos: (impuestoPorcentaje) =>
    set((state) => ({
      factura: {
        ...state.factura,
        impuestoPorcentaje,
      },
    })),
  // Cambia método de pago
  cambiarMetodoPago: (metodo) =>
    set((state) => ({
      factura: {
        ...state.factura,
        tipoPago: metodo,
      },
    })),
  // Agrega un servicio (detalle) a la factura
  agregarServicioAFactura: (detalle: FacturaDetalleItem) =>
    set((state) => {
      // Busca si ya existe un item con ese id en la factura
      const exists = state.factura.serviciosIds.find((d) => d.id === detalle.id);
      let nuevosDetalles;
      if (exists) {
        // Si existe, incrementamos la cantidad y recalculamos el total
        nuevosDetalles = state.factura.serviciosIds.map((d) => {
          if (d.id === detalle.id) {
            // Lógica de incremento:
            const nuevaCantidad = d.cantidad + detalle.cantidad;
            // Si tu total es (precio unitario * cantidad), recalcula así:
            const nuevoTotal = Number(d.total) + Number(detalle.total);
            // O, si guardas un precio unitario en 'detalle' y sumas cantidades, podrías hacer:
            // const precioUnit = d.total / d.cantidad; 
            // const nuevoTotal = precioUnit * nuevaCantidad;
            return {
              ...d,
              cantidad: nuevaCantidad,
              total: nuevoTotal,
            };
          }
          return d; // Los demás ítems no cambian
        });
      } else {
        // Si no existe, agregamos el nuevo ítem
        nuevosDetalles = [...state.factura.serviciosIds, detalle];
      }

      // Recalculamos el total global
      const newPrecio = nuevosDetalles.reduce((acc, d) => acc + d.total, 0);

      return {
        factura: {
          ...state.factura,
          serviciosIds: nuevosDetalles,
          total: newPrecio,
        },
      };
    }),
  // Método opcional para regenerar un invoiceId sin depender de la cita
  generarInvoiceId: () =>
    set((state) => ({
      factura: {
        ...state.factura,
        id: nanoid(),
      },
    })),
}))