import { Edit, Opc } from "@/assets/svg"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Cita, CitasMethod } from "@/types"
import { Calendario } from "@/assets/svg";
import { RefObject } from "react";
import { useStore } from "@/store/store";
import EliminarCitaDialog from "../dialog/eliminarCita.dialog";

interface Props {
    cita: Cita,
    dialogRef: RefObject<HTMLButtonElement>
}

const CrudTooltipDropdown = ({ cita, dialogRef }: Props) => {

    const seleccionarCita = useStore((state) => state.seleccionarCita)
    const cambiarCitasMethod = useStore((state) => state.cambiarCitasMethod)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <Opc className="size-3 fill-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[147px] space-y-2 px-2 py-1.5">
                <DropdownMenuItem onClick={() => {
                    seleccionarCita(cita)
                    dialogRef.current?.click()
                    cambiarCitasMethod(CitasMethod.REPROGRAMAR)
                }}>
                    <div className="w-full flex items-center py-1.5 gap-2">
                        <Calendario className="size-3 fill-[#3C3C3C]" />
                        <p className="font-light text-[#707070] text-xs first-letter:uppercase">Reprogramar</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                    seleccionarCita(cita)
                    dialogRef.current?.click()
                    cambiarCitasMethod(CitasMethod.ACTUALIZAR)
                }}>
                    <div className="w-full flex items-center py-1.5 gap-2">
                        <Edit className="size-3 stroke-[#3C3C3C]" />
                        <p className="font-light text-[#707070] text-xs first-letter:uppercase">Editar</p>
                    </div>
                </DropdownMenuItem>
                <EliminarCitaDialog cita={cita} />

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default CrudTooltipDropdown
