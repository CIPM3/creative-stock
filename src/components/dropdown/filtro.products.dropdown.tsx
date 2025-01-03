import { Arrow, Entradas, Filter, StockSvg, VentasSvg } from "@/assets/svg"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useProductosStore } from "@/store/store"
import { useEffect, useState } from "react"

const FiltroProductsDropdown = () => {

    const [SelectedFilter, setSelectedFilter] = useState<number | null>(null)

    const filters = [
        {
            icon: null,
            name: "Valor por defecto"
        },
        {
            icon: <div className="size-3 rounded-full border-[1px] border-[#867A28] bg-[#FFF9D4]" />,
            name: "Uñas"
        },
        {
            icon: <div className="size-3 rounded-full border-[1px] border-[#BC1275] bg-[#FFD4ED]" />,
            name: "Cabello"
        },
        {
            icon: <div className="size-3 rounded-full border-[1px] border-[#2892B3] bg-[#D4F5FF]" />,
            name: "Maquillaje"
        },
        {
            icon: <div className="size-3 rounded-full border-[1px] border-[#7B49E0] bg-[#E2D4FF]" />,
            name: "Otros"
        },
        {
            icon: <StockSvg className="stroke-red-500" />,
            name: "Stock bajo"
        },
        {
            icon: <StockSvg className="stroke-green-500" />,
            name: "Stock alto"
        },
        {
            icon: <VentasSvg className="fill-green-500" />,
            name: "Mayor venta"
        },
        {
            icon: <VentasSvg className="fill-red-500" />,
            name: "Menor venta"
        },
        {
            icon: <Entradas className="fill-green-500" />,
            name: "Entrada alta"
        },
        {
            icon: <Entradas className="fill-red-500" />,
            name: "Entrada baja"
        },
    ]

    const seleccionarFiltro = useProductosStore((state) => state.seleccionarFiltro)

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

export default FiltroProductsDropdown
