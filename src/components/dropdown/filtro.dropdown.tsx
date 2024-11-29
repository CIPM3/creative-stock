import { Arrow, Filter } from "@/assets/svg"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { obtenerIconoServicio, obtenerNombreServicio } from "@/funcs"

interface Props {
    array: string[],
  }

const FiltroDropdown = ({array}:Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex w-36 h-14 items-center font-semibold text-xl border border-[#3C3C3C] rounded-lg mt-3 justify-center gap-2">
                <Filter className="size-6 fill-[#3C3C3C]" />
                Filtrar
                <Arrow className="size-2 fill-[#3C3C3C]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px] px-4 py-2">
                {
                    array.map((data)=> (
                        <DropdownMenuItem>
                            <div className="w-full flex items-center gap-2">
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
