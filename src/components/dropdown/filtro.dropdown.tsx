import { Arrow, Filter } from "@/assets/svg"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { obtenerIconoServicio, obtenerNombreServicio } from "@/funcs"
import { Dispatch, SetStateAction } from "react"

interface Props {
    array: string[],
    setselectedFilter: Dispatch<SetStateAction<string>>,
    selectedFilter: string
}

const FiltroDropdown = ({ array, setselectedFilter, selectedFilter }: Props) => {

    return (

        <DropdownMenu key={'filter-dropdown'}>
            {
                selectedFilter === ""
                    ? (<DropdownMenuTrigger className="flex w-36 h-14 items-center font-semibold text-xl border border-[#3C3C3C] rounded-lg mt-3 justify-center gap-2">
                        <Filter className="size-6 fill-[#3C3C3C]" />
                        Filtrar
                        <Arrow className="size-2 fill-[#3C3C3C]" />
                    </DropdownMenuTrigger>)
                    : (
                        <div onClick={() => setselectedFilter("")} className="flex w-36 h-14 items-center font-semibold text-xl border border-[#3C3C3C] rounded-lg mt-3 justify-center gap-2">
                            <Filter className="size-6 fill-[#3C3C3C]" />
                            <div className="w-fit border border-[#3C3C3C] flex py-2 px-2 mx-2 rounded-lg cursor-pointer items-center gap-2">
                                <img className="size-5" src={obtenerIconoServicio(selectedFilter)} alt={selectedFilter} />
                            </div>
                            <Arrow className="size-2 fill-[#3C3C3C]" />
                        </div>)
            }

            <DropdownMenuContent className="w-[220px] relative">
                {
                    array.map((data:any,index) => (
                        <DropdownMenuItem key={index} onClick={() => setselectedFilter(data)} >
                            <div className="w-full flex py-2 px-4 cursor-pointer items-center gap-2">
                                <img className="size-5" src={obtenerIconoServicio(data)} alt={data} />
                                <p className="font-light text-[#707070] first-letter:uppercase">{obtenerNombreServicio(data)}</p>
                            </div>
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default FiltroDropdown
