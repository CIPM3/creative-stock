import { RefObject } from "react";
import { RandomColors } from "@/data";
import { Cita } from "@/types";
import TooltipDropdown from "../dropdown/tooltip.dropdown";
import CrudTooltipDropdown from "../dropdown/crud.tooltip.dropdown";
import AgendaInfo from "../dropdown/agendaInfo.tooltip";

interface Props{
    primerDiaDelMes:number,
    dia:string,
    diaIndex:number,
    filtrarYOrdenarCitas: (fechaFiltro: string) => Cita[],
    dialogRef:RefObject<HTMLButtonElement>,
    cancelarRef:RefObject<HTMLButtonElement>
}

const AgendaItem = ({primerDiaDelMes,dia,diaIndex,filtrarYOrdenarCitas,dialogRef}:Props) => {
    const nombresDias = ["dom", "lun", "mar", "mié", "jue", "vie", "sab"];

    //obtiene un array con los datos de las citas
    const filtro = filtrarYOrdenarCitas(`${dia}/${new Date().getMonth() + 1}/${new Date().getFullYear().toString().slice(-2)}`)
    

    return (
        <>
            <div onClick={()=>dialogRef.current?.click()} className="w-full cursor-pointer pt-4 flex items-center justify-center">
                <h3 className="font-light first-letter:uppercase text-[#3C3C3C]">{nombresDias[(diaIndex + primerDiaDelMes + 2) % 7]} {dia}</h3>
            </div>

            <div className="flex flex-col py-2 px-2 gap-2 w-full h-full ">
                {filtro.length > 3 ? (
                    <>
                        {filtro.slice(0, 3).map((cita) => (
                            <div className={`w-full ${RandomColors[Math.floor(Math.random() * RandomColors.length)]} flex items-center justify-between font-semibold py-1 px-2 text-white  rounded-lg`}>
                                <AgendaInfo cita={cita}/>
                                <CrudTooltipDropdown dialogRef={dialogRef}  cita={cita}/>
                            </div>
                        ))}

                        <TooltipDropdown
                         array={filtro.slice(- (filtro.length - 3))}
                        />
                    </>
                ) : (
                    filtro.map((cita) => (
                        <div className={`w-full ${RandomColors[Math.floor(Math.random() * RandomColors.length)]} flex items-center justify-between font-semibold py-1 px-2 text-white  rounded-lg`}>
                            <AgendaInfo cita={cita}/>
                            <CrudTooltipDropdown  dialogRef={dialogRef} cita={cita}/>
                        </div>
                    ))
                )}
            </div>
        </>
    )
}

export default AgendaItem
