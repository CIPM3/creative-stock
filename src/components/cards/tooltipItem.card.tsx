import { Close } from "@/assets/svg"
import { RandomColors } from "@/data"
import { obtenerIconoServicio } from "@/funcs"
import { useServiciosStore } from "@/store/store"
import { Cita, Servicio } from "@/types"
import { useEffect, useState } from "react"

interface PropsChild {
    cita: Cita,
}


const ToolTipItem = ({ cita }: PropsChild) => {

    const servicios = useServiciosStore((state) => state.servicio)

    useEffect(() => {
        obtenerDataDeServicio(cita.servicios)
    }, [])


    const [ServiciosCita, setServiciosCita] = useState<Servicio[]>([])

    const obtenerDataDeServicio = (serviciosId: string[]) => {
        const serviciosEncontrados = servicios.filter(servicio => serviciosId.includes(servicio?.id!!));

        setServiciosCita(serviciosEncontrados)
    }

    return (
        <div className="w-[250px] h-fit">
            <div className={`w-full h-fit flex items-center px-3 py-2 justify-between ${RandomColors[Math.floor(Math.random() * RandomColors.length)]} `}>
                <span className="text-white text-md">{cita.nombre}</span>
                <Close className="size-3 fill-white" />
            </div>

            <div className="bg-white px-2 py-2 flex items-start justify-between">
                <div className="grid grid-cols-2 w-1/2 gap-1">
                    {
                        ServiciosCita.map(servicio => (
                            <div className="size-10 relative cursor-pointer border group flex items-center justify-center  border-black rounded-lg group-hover:bg-gray-200">
                                <img src={obtenerIconoServicio(servicio.category)} alt={servicio.id} className=" size-7 object-cover" />
                                <span className="absolute text-[12px] bg-white hidden group-hover:block left-10 top-0 z-10">{servicio.name}</span>
                                
                            </div>
                        ))
                    }
                </div>

                <div className="grid w-1/2 grid-cols-1">
                    <p className="text-sm text-[#3C3C3C] font-bold text-end">{
                        cita.hora
                    }</p>
                    <p className="text-sm font-semibold text-[#9A9A9A] text-end">
                        {cita.total}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ToolTipItem
