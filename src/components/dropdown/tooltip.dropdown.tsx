import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Cita } from "@/types"
import ToolTipItem from "../cards/tooltipItem.card"

interface Props {
    array: Cita[],
}

const TooltipDropdown = ({ array }: Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="text-[#336EB1] text-end">
                + {array.length} más
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit flex flex-col gap-3 ">
                {
                    array.map((data) => (
                        <ToolTipItem cita={data} />
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default TooltipDropdown
