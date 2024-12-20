export enum CitasMethod {
    CREAR = 'crear',
    REPROGRAMAR = 'reprogramar',
    ACTUALIZAR = 'actualizar'
}

export type StoreState = {
    //CITAS
    citas: Cita[];
    cargarCitas: () => Promise<void>;
    agregarCita: (nuevaCita: Cita) => void;
    eliminarCita: (id: string) => void;
    selectedCita: Cita | null;
    seleccionarCita: (cita: Cita | null) => void;
    actualizarCita: (actualizadaCita: Cita) => void;
    citasMethod: CitasMethod;
    cambiarCitasMethod: (citaMethod: CitasMethod) => void
    //PRODUCTOS
    productos: Product[];
    cargarProduct: () => Promise<void>;
    selectedFilter: string | null;
    selectedProduct: Product | null;
    seleccionarFiltro: (categoria: string | null) => void;
    selectProducto: (id: string ) => void;
    searchInput: string | null;
    searchInputProduct: (search:string | null) => void;
    agregarProduct: (nuevoProducto: Product) => void;
    eliminarProduct: (id: string) => void;
    actualizarProduct: (prodcutoActualizado: Product) => void;
    //STOCK
    stock: Stock[],
    cargarStock: () => Promise<void>;
    //Precios
    precios: Precio[],
    cargarPrecios: () => Promise<void>;
};

export type Product = {
    id: string;
    name: string;
    category: string;
    stock: number;
    sells: number;
    incomes: number;
    fecha?: string
}

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

export type Stock = {
    id:string,
    cantidad:number,
    fecha: string,
    productoId:string,
    tipo:string
}

export type Precio = {
    id:string,
    precioCompra: number,
    precioVenta: number,
    productId:string
}

export interface StockSummary {
    date: string;
    entradaDeStock: number;
    salidaDeStock: number;
    productID: string;
}