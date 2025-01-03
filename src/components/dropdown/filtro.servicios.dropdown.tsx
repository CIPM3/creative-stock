import { Arrow, Calendario, Filter } from "@/assets/svg"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { obtenerIconoServicio } from "@/funcs"
import { useServiciosStore } from "@/store/store"
import { useEffect, useState } from "react"

const FiltroServiciosDropdown = () => {

    const [SelectedFilter, setSelectedFilter] = useState<number | null>(null)

    const filters = [
        {
            icon: null,
            name: "Valor por defecto"
        },
        {
            icon: <img className="size-5" src={obtenerIconoServicio('unas')}/>,
            name: "Uñas"
        },
        {
            icon: <img className="size-5" src={obtenerIconoServicio('corte')}/>,
            name: "Cabello"
        },
        {
            icon: <img className="size-5" src={obtenerIconoServicio('labial')}/>,
            name: "Maquillaje"
        },
        {
            icon: <img className="size-5" src={obtenerIconoServicio('masaje')}/>,
            name: "Masaje"
        },
        {
            icon: <Calendario className="fill-green-500" />,
            name: "Más agendados"
        },
        {
            icon: <Calendario className="fill-red-500" />,
            name: "menos agendados"
        },
    ]

    const seleccionarFiltro = useServiciosStore((state) => state.seleccionarFiltro)

    useEffect(() => {
        if (SelectedFilter! >= 0 && SelectedFilter !== null) {
            seleccionarFiltro(filters[SelectedFilter].name)
        }else{
            seleccionarFiltro(null)
        }
    }, [SelectedFilter])


    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
                <div className="px-2 h-14 w-full outline-none flex items-center justify-center gap-x-1 text-lg rounded-lg border border-[#707070]">
                    {
                        SelectedFilter !== null
                            ?
                            <div className="flex items-center gap-x-1 text-sm">
                                {
                                    SelectedFilter === 0
                                        ?
                                        (
                                            <div className="flex items-center gap-x-1">
                                                <Filter className="size-4 fill-[#707070]" />
                                                Filtrar
                                                <Arrow className="size-2 fill-[#707070]" />
                                            </div>
                                        )
                                        :
                                        (
                                            <>
                                                {filters[SelectedFilter].icon}
                                                <span className="text-[11px]">
                                                    {filters[SelectedFilter].name}
                                                </span>
                                            </>
                                        )
                                }
                            </div>
                            :
                            <div className="flex items-center gap-x-1">
                                <Filter className="size-4 fill-[#707070]" />
                                Filtrar
                                <Arrow className="size-2 fill-[#707070]" />
                            </div>
                    }

                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="py-4">
                {
                    filters.map((filter, index) => (
                        <DropdownMenuItem 
                        key={index}
                        onClick={() => {
                            setSelectedFilter(index)
                        }} className="flex items-center px-5 py-2 gap-x-1 ">
                            {filter.icon}
                            <span className="text-sm font-light text-[#3C3C3C]">
                                {filter.name}
                            </span>
                        </DropdownMenuItem>
                    ))
                }

            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default FiltroServiciosDropdown
