import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Cita } from "@/types"
import ToolTipItem from "../cards/tooltipItem.card"

interface Props {
    cita: Cita,
}

const AgendaInfo = ({ cita }: Props) => {
    return (
        <DropdownMenu key={`agendaInfo`}>
            <DropdownMenuTrigger className="outline-none">
                <h3 className="text-white text-sm font-bold">{cita.nombre}</h3>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full relative space-y-2">
                <DropdownMenuItem>
                    <ToolTipItem cita={cita} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default AgendaInfo
