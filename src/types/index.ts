export type StoreState = {
    bears: number;
    increasePopulation: () => void;
    decreasePopulation: () => void;
    removeAllBears: () => void;
    updateBears: (newBears: number) => void;
};

export type Cita = {
    fecha: string;
    hora: string;
    nombre: string;
    servicios: string[];
    total: number
  };