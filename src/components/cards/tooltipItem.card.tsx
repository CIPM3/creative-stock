import { Close } from "@/assets/svg"
import { RandomColors } from "@/data"
import { obtenerIconoServicio } from "@/funcs"
import { Cita } from "@/types"

interface PropsChild {
    cita: Cita,
}


const ToolTipItem = ({ cita }: PropsChild) => {
    return (
        <div className="w-[250px] h-fit">
            <div className={`w-full h-fit flex items-center px-3 py-2 justify-between ${RandomColors[Math.floor(Math.random() * RandomColors.length)]} `}>
                <span className="text-white text-md">{cita.nombre}</span>
                <Close className="size-3 fill-white" />
            </div>

            <div className="bg-white px-2 py-2 flex items-start justify-between">
                <div className="grid grid-cols-2 w-1/2 gap-1">
                    {
                        cita.servicios.map(servicio => (
                            <div className="size-10 border flex items-center justify-center border-black rounded-lg">
                                <img src={obtenerIconoServicio(servicio)} alt={servicio} className=" size-7 object-cover" />
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
