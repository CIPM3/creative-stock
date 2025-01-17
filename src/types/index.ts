export enum CitasMethod {
    CREAR = 'crear',
    REPROGRAMAR = 'reprogramar',
    ACTUALIZAR = 'actualizar'
}

//STORE TYPES
export type StoreCitas = {
    citas: Cita[];
    cargarCitas: () => Promise<void>;
    agregarCita: (nuevaCita: Cita) => void;
    eliminarCita: (id: string) => void;
    selectedCita: Cita | null;
    seleccionarCita: (cita: Cita | null) => void;
    actualizarCita: (actualizadaCita: Cita) => void;
    citasMethod: CitasMethod;
    cambiarCitasMethod: (citaMethod: CitasMethod) => void
}

export type StoreProducts = {
    productos: Product[];
    cargarProduct: () => Promise<void>;
    selectedFilter: string | null;
    selectedProduct: Product | null;
    seleccionarFiltro: (categoria: string | null) => void;
    selectProducto: (id: string) => void;
    searchInput: string | null;
    searchInputProduct: (search: string | null) => void;
    agregarProduct: (nuevoProducto: Product) => void;
    eliminarProduct: (id: string) => void;
    actualizarProduct: (prodcutoActualizado: Product) => void;
}

export type StoreStock = {
    stock: Stock[],
    cargarStock: () => Promise<void>;
}

export type StorePrecios = {
    precios: Precio[],
    cargarPrecios: () => Promise<void>;
}

export type StoreServicio = {
    servicio: Servicio[],
    cargarServicios: () => Promise<void>;
    selectedFilter: string | null;
    agregarServicio: (nuevoProducto: Servicio) => void;
    seleccionarFiltro: (categoria: string | null) => void;
    getServiciosByCita: (serviciosId: string[]) => Servicio[];
    getServicioById: (id: string) => Servicio | null;
}

export type StorePOV = {
    servicioPOV: Servicio[];
    productosPOV: Product[];
    selectedAgendado: Cita | null;

    factura: FacturaItem;  // <--- ahora es un solo objeto (no un array)
    facturas: FacturaItem[];
    agregarServiciosAPov: (servicio: Servicio[]) => void;
    agregarProductosAPov: (producto: Product[]) => void;
    seleccionarAgendado: (cita: Cita | null) => void;
    cargarFacturas: () => Promise<void>;
    agregarAFactura: (item: FacturaItem) => void;
    actualizarFactura: (cambios: Partial<FacturaItem>) => void; // sin `id`, porque ya habrá solo uno
    limpiarFactura: () => void;
    eliminarServicioFactura: (servicioId: string) => void;
    actualizarImpuestos: (impuestoPorcentaje: number) => void;
    cambiarMetodoPago: (metodo: 'efectivo' | 'tarjeta') => void;
    agregarServicioAFactura: (detalle: FacturaDetalleItem) => void;
    generarInvoiceId: () => void;
}

export type FacturaDetalleItem = {
    id: string;         // Id del servicio o producto
    name: string;       // Nombre del servicio o producto
    cantidad: number;   // Cantidad adquirida para este ítem
    total: number;      // Total para este ítem (por ejemplo, precio unitario * cantidad)
}

export type FacturaItem = {
    id: string;                        // Identificador único del ítem de factura  
    serviciosIds: FacturaDetalleItem[];  // Arreglo de detalles de servicios o productos  
    total: number;                    // Cantidad total adquirida (puede servir para datos globales si se requiere)
    impuestoPorcentaje: number;        // Porcentaje de impuestos  
    tipoPago: 'efectivo' | 'tarjeta';    // Tipo de pago  
    idCita: string;                    // ID de la cita  
    fecha?: string;
    tipo?: 'Productos' | 'Servicios'
}


//NORMAL TYPES
export type Product = {
    id: string;
    name: string;
    category: string;
    stock: number;
    sells: number;
    incomes: number;
    fecha?: string;
    total?: number
    precio?: number
}

export type Cita = {
    id?: string;
    fecha: string;
    hora: string;
    nombre: string;
    servicios: string[];
    total: number
    pagado?: boolean
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
    id: string,
    cantidad: number,
    fecha: string,
    productoId: string,
    tipo: string
}

export type Precio = {
    id: string,
    precioCompra: number,
    precioVenta: number,
    productId: string
}

export interface StockSummary {
    date: string;
    entradaDeStock: number;
    salidaDeStock: number;
    productID: string;
    tipo?: string
}

export type Servicio = {
    id?: string;
    name: string;
    category: string;
    agendados: number;
    total: number;
    precio?: number
}

export type CategoryMap = {
    Productos: {
        [key in 'todo' | 'cabello' | 'maquillaje' | 'unas' | 'otros']: Product['category'] | null;
    };
    Servicios: {
        [key in 'todo' | 'cabello' | 'maquillaje' | 'unas' | 'otros']: Servicio['category'] | null;
    };
};

export interface Stats {
    ventasDelDia: number;
    ventasDelMes: number;
    salidasDelDia: number;
    salidasDelMes: number;
}


export type FieldSelectedType = 'Productos' | 'Servicios';
export type ItemFiltersType = 'todo' | 'cabello' | 'maquillaje' | 'unas' | 'otros';
