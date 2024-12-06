
import { obtenerIconoServicio, obtenerNombreServicio } from "@/funcs"
import { useEffect, useState } from "react";
import { FormikErrors } from 'formik'
import { Arrow } from "@/assets/svg";

interface Props {
  onChange: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<{
    nombre: string;
    apellido: string;
    hora: string;
    servicios: string[];
    fecha: string;
    total: string;
  }>>,
  value?: string[],
  serviciosExistentes?: string[]
}

const SelectCustom = ({ onChange, serviciosExistentes = [] }: Props) => {
  const [seleccionados, setSeleccionados] = useState<string[]>(serviciosExistentes);

  const [isOpen, setisOpen] = useState(false)

  const handleSelect = (value: string) => {
    setSeleccionados(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const servicios = [
    'unas',
    'corte',
    'labial',
    'masaje'
  ]

  useEffect(() => {
    onChange("servicios", seleccionados);
  }, [seleccionados]);

  const serviciosFiltrados = servicios.filter(servicio => !seleccionados.includes(servicio));

  return (
    <div className="w-full z-[1] relative py-2 flex items-center border border-[#707070] rounded-lg">
      {/* TRIGGER */}
      <div className="overflow-hidden" >
        <div className="flex overflow-x-auto w-full pl-3 z-[4] rounded-lg items-center gap-3">
          {seleccionados.length > 0 ? (
            seleccionados.map((index) =>
              <div onClick={() => handleSelect(index)} className="w-fit relative flex items-center  gap-2 cursor-pointer">
                <img className="size-5" src={obtenerIconoServicio(index)} alt={index} />
                <p className="font-light text-[12px] text-[#707070] first-letter:uppercase">{obtenerNombreServicio(index)}</p>
              </div>
            )
          ) : (
            <p onClick={() => { setisOpen(!isOpen) }} className="text-[15px] font-semibold">Tipo de Servicio</p>
          )}
        </div>
        <div onClick={() => { setisOpen(!isOpen) }} className="w-[25%] h-full cursor-pointer bg-blue-500">
          <Arrow className={`${isOpen ? 'rotate-180' : "rotate-0"} cursor-pointer transition-all stroke-[#707070] absolute right-3
        top-[40%] fill-[#707070]`} />
        </div>

      </div>
      {/* CONTENT */}
      <div className={`absolute transition-all ease-linear ${isOpen ? 'visible opacity-100' : "invisible opacity-0"} w-full p-2 top-12 border border-[#707070] rounded-lg left-0 bg-white`}>
        {
          serviciosFiltrados.map(index => (
            <div onClick={() => handleSelect(index)} className="w-full flex items-center gap-2 cursor-pointer px-2 py-1.5">
              <img className="size-5" src={obtenerIconoServicio(index)} alt={index} />
              <p className="font-light text-[#707070] first-letter:uppercase">{obtenerNombreServicio(index)}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

//border-[#707070]

export default SelectCustom

