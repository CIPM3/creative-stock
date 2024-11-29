import { Opc } from "@/assets/svg";
import { RandomColors } from "@/data";
import { Cita } from "@/types";

interface Props{
    primerDiaDelMes:number,
    dia:number,
    diaIndex:number,
    filtrarYOrdenarCitas: (fechaFiltro: string) => Cita[]
}

const AgendaItem = ({primerDiaDelMes,dia,diaIndex,filtrarYOrdenarCitas}:Props) => {
    const nombresDias = ["dom", "lun", "mar", "mié", "jue", "vie", "sab"];

    return (
        <>
            <div className="w-full pt-4 flex items-center justify-center">
                <h3 className="font-light first-letter:uppercase text-[#3C3C3C]">{nombresDias[(diaIndex + primerDiaDelMes + 2) % 7]} {dia}</h3>
            </div>

            <div className="flex flex-col px-2 gap-2 w-full h-full ">
                {filtrarYOrdenarCitas(dia.toString()).map((cita) => (
                    <div className={`w-full ${RandomColors[Math.floor(Math.random() * RandomColors.length)]} flex items-center justify-between font-semibold py-1 px-2 text-white  rounded-lg`}>
                        {cita.nombre}
                        <Opc className="size-4 fill-white"/>
                    </div>
                ))}
            </div>
        </>
    )
}

export default AgendaItem
