import { create } from 'zustand'
import { StoreState } from '../types'

export const useStore = create<StoreState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  decreasePopulation: () => set((state) => ({ bears: state.bears - 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}))
