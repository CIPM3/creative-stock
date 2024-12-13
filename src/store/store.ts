import { create } from 'zustand'
import { Cita, CitasMethod, StoreState } from '../types'
import { getCitas } from '@/api/citas/citas.get'

export const useStore = create<StoreState>((set) => ({
  //CITAS
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
  }),

  //PRODUCTO
  productos: [
    {
      id: 'a1B2c3D4e5F6g7H8',
      name: 'Labial KY',
      category: 'maquillaje',
      incomes: 3425,
      sells: 850,
      stock: 25,
      fecha: '15/08/23 03:45 PM'
    },
    {
      id: 'Zx9Y8w7V6u5T4s3R',
      name: 'Shampoo KY',
      category: 'cabello',
      incomes: 2750,
      sells: 600,
      stock: 50,
      fecha: '22/11/23 10:30 AM'
    },
    {
      id: 'Abc123XYZ7890def',
      name: 'Esmalte KY',
      category: 'uñas',
      incomes: 4300,
      sells: 750,
      stock: 60,
      fecha: '05/05/24 09:15 PM'
    },
    {
      id: 'Gh7Jk8Lm9No0Pq1R',
      name: 'Acondicionador LX',
      category: 'cabello',
      incomes: 3100,
      sells: 700,
      stock: 40,
      fecha: '12/02/24 11:00 AM'
    },
    {
      id: 'St2Uv3Wx4Yz5Aa6B',
      name: 'Base de Maquillaje MX',
      category: 'maquillaje',
      incomes: 5000,
      sells: 900,
      stock: 30,
      fecha: '20/07/23 02:20 PM'
    },
    {
      id: 'Cd7Ef8Gh9Ij0Kl1M',
      name: 'Máscara Volumizadora KY',
      category: 'maquillaje',
      incomes: 2900,
      sells: 650,
      stock: 45,
      fecha: '18/09/23 04:50 PM'
    },
    {
      id: 'Bn3Op4Qr5St6Uv7W',
      name: 'Spray Fijador CX',
      category: 'cabello',
      incomes: 3600,
      sells: 800,
      stock: 35,
      fecha: '25/10/23 01:10 PM'
    },
    {
      id: 'Xy1Za2Bc3De4Fg5H',
      name: 'Delineador LX',
      category: 'maquillaje',
      incomes: 4100,
      sells: 820,
      stock: 28,
      fecha: '08/03/24 12:30 PM'
    },
    {
      id: 'Jk6Lm7No8Pq9Rs0T',
      name: 'Esmalte Brillante MX',
      category: 'uñas',
      incomes: 2200,
      sells: 500,
      stock: 70,
      fecha: '14/06/23 05:25 PM'
    },
    {
      id: 'Uv4Wx5Yz6Aa7Bb8C',
      name: 'Serum Reparador KY',
      category: 'cabello',
      incomes: 4800,
      sells: 950,
      stock: 20,
      fecha: '30/12/23 08:40 AM'
    },
    {
      id: 'Dq9Rs0Tu1Vw2Xy3Z',
      name: 'Rubor LX',
      category: 'maquillaje',
      incomes: 3400,
      sells: 770,
      stock: 33,
      fecha: '09/04/24 07:55 PM'
    },
    {
      id: 'Fg4Hi5Jk6Lm7No8P',
      name: 'Limador Profesional MX',
      category: 'uñas',
      incomes: 1800,
      sells: 400,
      stock: 80,
      fecha: '17/01/24 10:05 AM'
    },
    {
      id: 'Qr1St2Uv3Wx4Yz5A',
      name: 'Iluminador MX',
      category: 'maquillaje',
      incomes: 3900,
      sells: 830,
      stock: 27,
      fecha: '23/07/23 03:35 PM'
    },
    {
      id: 'Bc6De7Fg8Hi9Jk0L',
      name: 'Aceite Capilar CX',
      category: 'cabello',
      incomes: 2600,
      sells: 620,
      stock: 55,
      fecha: '11/05/24 09:50 AM'
    },
    {
      id: 'Mn2Op3Qr4St5Uv6W',
      name: 'Top Coat KY',
      category: 'uñas',
      incomes: 2000,
      sells: 450,
      stock: 65,
      fecha: '19/08/23 02:15 PM'
    }
  ],
  selectedFilter: null,
  seleccionarFiltro: (categoria: string | null) => set({ selectedFilter: categoria }),
  searchInput: null,
  searchInputProduct: (search: string | null) => set({ searchInput: search }),
  agregarProduct: async (nuevoProducto) => {
    set((state) => ({ productos: [...state.productos, nuevoProducto] }));
  },
  // Agregar las funciones faltantes
  cargarProduct: async () => { }, // Implementar lógica más tarde
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
}))
