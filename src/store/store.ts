import { create } from 'zustand'
import { Cita, CitasMethod, StoreState } from '../types'
import { getCitas } from '@/api/citas/citas.get'

export const useStore = create<StoreState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  decreasePopulation: () => set((state) => ({ bears: state.bears - 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),

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
}))
