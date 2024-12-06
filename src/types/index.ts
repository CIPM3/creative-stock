export enum CitasMethod {
    CREAR = 'crear',
    REPROGRAMAR = 'reprogramar',
    ACTUALIZAR = 'actualizar'
}

export type StoreState = {
    bears: number;
    increasePopulation: () => void;
    decreasePopulation: () => void;
    removeAllBears: () => void;
    updateBears: (newBears: number) => void;
    citas: Cita[];
    cargarCitas: () => Promise<void>;
    agregarCita: (nuevaCita: Cita) => void;
    eliminarCita: (id: string) => void;
    selectedCita: Cita | null;
    seleccionarCita: (cita: Cita | null) => void;
    actualizarCita: (actualizadaCita: Cita) => void;
    citasMethod: CitasMethod;
    cambiarCitasMethod: (citaMethod: CitasMethod) => void
};

export type Cita = {
    id?: string;
    fecha: string;
    hora: string;
    nombre: string;
    servicios: string[];
    total: number
};

export type CitaInput = {
    id?: string;
    nombre: string;
    servicios: string[];
    hora: string;
    total: string;
    fecha: string;
}