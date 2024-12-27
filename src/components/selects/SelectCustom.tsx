import { calcularTotalServicios, obtenerIconoServicio } from "@/funcs";
import { useEffect, useState } from "react";
import { Arrow } from "@/assets/svg";
import { useServiciosStore } from "@/store/store";
import { Servicio } from "@/types";

interface Props {
  value?: Servicio[];
  serviciosExistentes?: Servicio[];
  setFieldValue: (field: string, value: any) => void;
}

const SelectCustom = ({ serviciosExistentes = [], setFieldValue }: Props) => {
  // Filtrar servicios existentes para eliminar posibles undefined
  const [seleccionados, setSeleccionados] = useState<Servicio[]>(
    serviciosExistentes.filter((s): s is Servicio => s !== undefined && s !== null)
  );

  const cargarServicios = useServiciosStore((state) => state.cargarServicios);

  useEffect(() => {
    cargarServicios();
  }, [cargarServicios]);

  const [isOpen, setIsOpen] = useState(false);

  const servicios = useServiciosStore((state) => state.servicio) || [];

  const handleSelect = (valorSeleccionado: string) => {
    setSeleccionados((prev) => {
      const servicioSeleccionado = servicios.find(
        (servicio) => servicio.name === valorSeleccionado
      );

      if (!servicioSeleccionado || !servicioSeleccionado.id) return prev;

      const yaSeleccionado = prev.some(
        (item) => item.name === valorSeleccionado
      );

      const nuevosSeleccionados = yaSeleccionado
        ? prev.filter((item) => item.name !== valorSeleccionado)
        : [...prev, servicioSeleccionado].filter(
            (servicio) => servicio !== undefined && servicio !== null
          );

      // Mapear los IDs y filtrar cualquier valor undefined o null
      const serviciosIds = nuevosSeleccionados
        .map((servicio) => servicio.id)
        .filter((id): id is string => id !== undefined && id !== null);

      // Actualizar los valores del formulario
      setFieldValue("servicios", serviciosIds);
      setFieldValue("total", calcularTotalServicios(nuevosSeleccionados));

      return nuevosSeleccionados;
    });
  };

  const serviciosFiltrados = servicios.filter(
    (servicio) =>
      !seleccionados.some((seleccionado) => seleccionado.name === servicio.name)
  );

  return (
    <div className="w-full z-[1] relative py-2 flex items-center border border-[#707070] rounded-lg">
      {/* TRIGGER */}
      <div className="overflow-hidden">
        <div className="flex overflow-x-auto w-full pl-3 z-[4] rounded-lg items-center gap-3">
          {seleccionados.length > 0 ? (
            seleccionados.map((servicio) => (
              <div
                key={servicio.id}
                onClick={() => handleSelect(servicio.name)}
                className="w-fit relative flex items-center gap-2 cursor-pointer"
              >
                <img
                  className="size-5"
                  src={obtenerIconoServicio(servicio.category)}
                  alt={servicio.id}
                />
                <p className="font-light text-[12px] text-[#707070] first-letter:uppercase">
                  {servicio.name}
                </p>
              </div>
            ))
          ) : (
            <p
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              className="text-[15px] font-semibold"
            >
              Tipo de Servicio
            </p>
          )}
        </div>
        <div
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className="w-[25%] h-full cursor-pointer bg-blue-500"
        >
          <Arrow
            className={`${
              isOpen ? "rotate-180" : "rotate-0"
            } cursor-pointer transition-all stroke-[#707070] absolute right-3 top-[40%] fill-[#707070]`}
          />
        </div>
      </div>
      {/* CONTENT */}
      <div
        className={`absolute transition-all ease-linear ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        } w-full max-h-60 p-2 overflow-y-auto top-12 border border-[#707070] rounded-lg left-0 bg-white`}
      >
        {serviciosFiltrados.map((servicio) => (
          <div
            key={servicio.id}
            onClick={() => handleSelect(servicio.name)}
            className="w-full flex items-center gap-2 cursor-pointer px-2 py-1.5"
          >
            <img
              className="size-5"
              src={obtenerIconoServicio(servicio.category)}
              alt={servicio.id}
            />
            <p className="font-light text-[#707070] first-letter:uppercase">
              {servicio.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectCustom;
