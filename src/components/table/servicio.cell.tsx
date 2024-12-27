import { Opc } from "@/assets/svg"
import { obtenerIconoServicio } from "@/funcs"
import { Servicio } from "@/types"


interface Props {
    servicio: Servicio
}

const ServiciosCell = ({ servicio }: Props) => {

    //const navigate = useNavigate()

    return (
        <div
            key={servicio.id}
            className="grid grid-cols-8 w-full col-start-1 col-end-9 items-center border-b-[1px] border-[#707070] py-3">
            <div className="col-start-1 first-letter:uppercase cursor-pointer text-xl col-end-3 pl-20 text-[#707070] font-semibold">
                {servicio.name}
            </div>
            <div className="col-start-3 cursor-pointer text-xl col-end-4 flex justify-start pl-10  text-[#707070] font-semibold">
                <img className="size-8" src={`${obtenerIconoServicio(servicio.category)}`} alt={`${servicio.category}`} />
            </div>
            <div className="col-start-4 cursor-pointer text-xl col-end-5 flex justify-start pl-5 text-[#707070] font-semibold">
                {servicio.agendados}
            </div>
            <div className="col-start-5 cursor-pointer text-xl col-end-6 flex justify-start pl-5 text-[#19AD0F] font-semibold">
                ${servicio.total}
            </div>

            <div className="col-start-7 col-end-9 flex gap-x-1 items-center justify-end pr-5">
                <div className="border-[1px] cursor-pointer border-[#3C3C3C] p-3 rounded-md">
                    <Opc className="size-5 fill-[#3C3C3C]" />
                </div>
            </div>
        </div>
    )
}

export default ServiciosCell
