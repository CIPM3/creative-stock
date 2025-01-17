import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { EllipsisVertical } from "lucide-react"

interface Props {
    onClick: () => void
}

const CancelarFacturaDropdown = ({onClick}:Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="border border-[#707070] size-12 flex items-center justify-center px-2 py-1 rounded-md text-[#3c3c3c]">
                <EllipsisVertical className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-[2vw]">
                <DropdownMenuItem onClick={()=>onClick()} className="text-red-500 font-light px-6 py-2">Cancelar orden</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default CancelarFacturaDropdown
