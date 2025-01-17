import { getCatColors } from "@/funcs"
import { usePOVStore } from "@/store/store"
import { FacturaDetalleItem, Product } from "@/types"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"

interface CardProps {
    product: Product
}

const PovProductCard = ({ product }: CardProps) => {
    const Factura = usePOVStore((s) => s.factura);
    const AGREGAR_A_FACTURA = usePOVStore((state) => state.agregarServicioAFactura);

    const [detalleServicio, setdetalleServicio] = useState<FacturaDetalleItem | null>(null);

    // Para saber si el producto ya existe en la factura
    const existeEnFactura = Factura.serviciosIds.some((producto) => producto.id === product.id);

    useEffect(() => {
        // Creamos el detalleServicio local a partir de la factura (si existe, tomamos su cantidad)
        const cantidadActual = Factura.serviciosIds.find((producto) => producto.id === product.id)?.cantidad ?? 1;
        const detallesServicio: FacturaDetalleItem = {
            id: product.id!,
            name: product.name,
            cantidad: cantidadActual,
            total: Number(product.total ?? 0),
        };
        setdetalleServicio(detallesServicio);
    }, [Factura, product]);

    const handleClick = () => {
        if (!detalleServicio) return;
        AGREGAR_A_FACTURA(detalleServicio);
    };

    return (
        <div className="col-span-2 p-3 rounded-lg grid grid-cols-1 gap-1 grid-rows-5 row-span-1 border-[1px] border-[#3c3c3c]">
            <div className="col-span-1 row-start-1 row-end-4 max-w-[90%] flex items-start justify-between">
                <h3 className="text-lg font-bold">{product.name}</h3>
            </div>
            <div className="col-span-1 row-start-4 row-end-5 flex items-center justify-between">
                <span className="col-span-1 row-start-4 row-end-5 text-[#19AD0F] text-xl font-bold">
                    ${product.total ?? 0}
                </span>
                <span className={`size-5 rounded-full border-[1px] ${getCatColors(product.category)}`} />
            </div>

            {/* Solo renderizamos el botón si NO existe ya en la factura */}
            {!existeEnFactura && (
                <button
                    onClick={handleClick}
                    className="col-span-1 row-start-5 row-end-6 bg-blue-500 flex items-center justify-center rounded-lg"
                >
                    <Plus className="text-white" />
                </button>
            )}
        </div>
    );
};

export default PovProductCard
