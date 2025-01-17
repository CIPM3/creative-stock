import { getCatColors } from "@/funcs"
import { usePOVStore } from "@/store/store"
import { FacturaDetalleItem, Servicio } from "@/types"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"

interface CardProps {
    service: Servicio
}

const PovServicioCard = ({ service }: CardProps) => {
    const SELECTED_AGENDADO = usePOVStore((state) => state.selectedAgendado);
    const factura = usePOVStore((state) => state.factura);                 // ← Lee la factura del store
    const AGREGAR_A_FACTURA = usePOVStore((state) => state.agregarServicioAFactura);
  
    // Checamos si ya existe en la factura
    const existeEnFactura = factura.serviciosIds.some((item) => item.id === service.id);
  
    // Estado local para manejar los detalles (cantidad, total)
    const [detalleServicio, setDetalleServicio] = useState<FacturaDetalleItem | null>(null);
  
    useEffect(() => {
      // Si ya existe en la factura, tomamos la cantidad actual
      // De lo contrario, la cantidad será 1 por defecto
      const cantidadActual = factura.serviciosIds.find((item) => item.id === service.id)?.cantidad ?? 1;
  
      const nuevoDetalle: FacturaDetalleItem = {
        id: service.id!,
        name: service.name,
        cantidad: cantidadActual,
        total: service.total ?? 0, // precio unitario
      };
  
      setDetalleServicio(nuevoDetalle);
    }, [factura, service]);
  
    const handleClick = () => {
      if (!SELECTED_AGENDADO) return;
      if (!detalleServicio) return;
  
      AGREGAR_A_FACTURA(detalleServicio);
    };
  
    return (
      <div className="col-span-2 p-3 row-span-1 gap-y-2 rounded-lg grid grid-cols-1 gap-1  border-[1px] border-[#3c3c3c]">
        <div className="col-span-1 row-start-1 row-end-4 max-w-[90%] flex items-start justify-between">
          <h3 className="text-lg font-bold">{service.name}</h3>
        </div>
        <div className="col-span-1 row-start-4 row-end-5 flex items-center justify-between">
          <span className="col-span-1 row-start-4 row-end-5 text-[#19AD0F] text-xl font-bold">
            ${service.total}
          </span>
          <span className={`size-5 rounded-full border-[1px] ${getCatColors(service.category)}`} />
        </div>
        
        {/* Si ya existe en la factura, ocultamos el botón */}
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

export default PovServicioCard
