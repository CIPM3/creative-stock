import { Opc } from "@/assets/svg"
import { RandomColors } from "@/data"
import { obtenerIconoServicio } from "@/funcs"
import { Cita } from "@/types"


interface Props {
  cita:Cita
}

const AgendaCard = ({cita}:Props) => {
  return (
    <div className="border border-black overflow-hidden rounded-lg">
      <div className={`w-full ${RandomColors[Math.floor(Math.random() * RandomColors.length)]}  px-3 py-2 h-fit flex items-center justify-between`}>
        <h3 className="text-white text-sm font-bold">{cita.nombre}</h3>
        <Opc className="size-4 cursor-pointer fill-white" />
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
            ${cita.total}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AgendaCard
