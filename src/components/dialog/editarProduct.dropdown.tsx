import { Opc } from "@/assets/svg"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Product } from "@/types"
import EditDeleteDialog from "./editDelete.dialog"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { useRef } from "react"

interface Props {
    product: Product
}

const EditarProductoTable = ({ product }: Props) => {
    
    const closeRef = useRef<HTMLDivElement>(null);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <div className="border-[1px] border-[#3C3C3C] rounded-lg px-3 py-3">
                    <Opc className="size-5 fill-black" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col">
                <EditDeleteDialog onClick={()=>closeRef.current?.click()} product={product} type="editar" />
                <EditDeleteDialog onClick={()=>closeRef.current?.click()} product={product} type="eliminar" />
                <DropdownMenuItem ref={closeRef}></DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default EditarProductoTable
