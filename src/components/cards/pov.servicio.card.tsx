import { getCatColors } from "@/funcs"
import { Servicio } from "@/types"
import { Plus } from "lucide-react"

interface CardProps {
    service: Servicio
}

const PovServicioCard = ({service}:CardProps) => {
    return (
        <div className="col-span-2 p-3 rounded-lg grid grid-cols-1 gap-1 grid-rows-5 row-span-1 border-[1px] border-[#3c3c3c]">
            <div className="col-span-1 row-start-1 row-end-4 max-w-[90%] flex items-start justify-between">
                <h3 className="text-lg font-bold">{service.name}</h3>
            </div>
            <div className="col-span-1 row-start-4 row-end-5 flex items-center justify-between">
                <span className="col-span-1 row-start-4 row-end-5 text-[#19AD0F] text-xl font-bold">${service.total}</span>

                <span className={`size-5 rounded-full border-[1px] ${getCatColors(service.category)}`}></span>
            </div>
            <button className="col-span-1 row-start-5 row-end-6 bg-blue-500 flex items-center justify-center rounded-lg">
                <Plus className="text-white" />
            </button>
        </div>
    )
}

export default PovServicioCard
