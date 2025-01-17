import { Calendario, CategoriaSvg, Search } from "@/assets/svg";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, ListFilter, Plus } from "lucide-react";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react"
import { Input } from "../ui/input";
import { getCatColors } from "@/funcs";
import { Cita, Servicio } from "@/types";
import { useCitasStore, usePOVStore, useServiciosStore } from "@/store/store";

interface DIALOG_POV_PROPS {
    setPOV: Dispatch<SetStateAction<boolean>>;
    setFieldSelected: Dispatch<SetStateAction<'Productos'| 'Servicios'>>
}

const POVAgendadosDialog = ({ setPOV,setFieldSelected }: DIALOG_POV_PROPS) => {

    const dialogRef = useRef<HTMLButtonElement>(null);

    const citas = useCitasStore((state)=>state.citas)
    const cargarCitas = useCitasStore((state)=>state.cargarCitas)

    useEffect(() => {
      cargarCitas()
    }, [citas])
    

    return (
        <Dialog>
            <DialogTrigger className="col-span-1 h-1/2  rounded-lg
          border-[1px] border-[#3c3c3c]  flex flex-col gap-6 justify-center bg-white items-center
          " ref={dialogRef}>
                <div className="flex items-center gap-x-2">
                    <Calendario className="size-14 fill-[#3c3c3c]" />
                    <Plus className="size-8 text-[#3c3c3c]" />
                </div>
                <span className="text-2xl font-bold text-[#3c3c3c]">Realizar pago <br /> de agendados</span>
            </DialogTrigger>
            <DialogContent className="max-w-[85vw] flex justify-center w-full pt-14 pl-6 pr-10">
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>

                </DialogHeader>
                <div className="w-full h-full col-start-1 col-end-13 grid grid-cols-12 grid-rows-12">
                    <div className="col-start-1 col-end-13 items-center grid gap-x-3 grid-cols-12 row-span-1">
                        <h3 className="text-4xl font-semibold text-[#3c3c3c] col-span-4">Agendados</h3>

                        <button
                            className="flex rounded-md col-span-1 items-center justify-center gap-x-2 border-[1px] border-[#707070] h-full col-start-8 col-end-9"
                        ><ListFilter /> Filtrar
                        </button>
                        <div className="w-full col-start-9 col-end-13 flex items-center pl-3 rounded-lg bg-[#EAEAEA] gap-3 ">
                            <Search className="size-6 fill-[#3C3C3C]" />
                            <Input className="w-full border-none bg-transparent ring-inset-0 outline-none ring-offset-0 ring-0" />
                        </div>
                    </div>

                    <div className="col-start-1 col-end-13 grid items-center grid-cols-12 pt-4 pb-2 row-span-2">
                        <h3 className="text-xl text-[#3c3c3c] pl-5 font-semibold col-start-1 col-end-4">Nombre Apellido</h3>

                        <div className="flex items-center text-xl text-[#3c3c3c] font-semibold gap-x-2 col-span-2">
                            <CategoriaSvg />
                            Categoria
                        </div>

                        <div className="flex items-center text-xl text-[#3c3c3c] font-semibold gap-x-2 col-span-2">
                            <CalendarIcon />
                            Dia de la cita
                        </div>
                    </div>

                    <div className="col-start-1 col-end-13 grid grid-cols-12 grid-rows-12 row-span-10 border-[1px] border-[#707070] rounded-md">
                        {
                            citas.filter(cita => cita.pagado !== true).map((cita,index) =><DialogTableCard key={index} cita={cita} dialogRef={dialogRef} setPOV={setPOV} setFieldSelected={setFieldSelected}/> )
                        }
                        

                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}

interface CardProps{
    cita: Cita,
    dialogRef: RefObject<HTMLButtonElement>,
    setPOV: Dispatch<SetStateAction<boolean>>,
    setFieldSelected: Dispatch<SetStateAction<'Productos'| 'Servicios'>>
}

const DialogTableCard = ({cita,dialogRef,setPOV,setFieldSelected}:CardProps) => {

    const servicioById = useServiciosStore((state)=>state.getServicioById)
    const [ServiciosData, setServiciosData] = useState<(Servicio | null)[]>()

    const selectAgendado = usePOVStore((state)=>state.seleccionarAgendado)

    useEffect(() => {
      const data = cita.servicios.map(id => servicioById(id))
      setServiciosData(data)
    }, [cita])
    
    const handleClick = () => {
        setFieldSelected("Servicios")
        setPOV(true)
        selectAgendado(cita)
        dialogRef.current?.click()
    }

    return (
        <div className="col-start-1 border-b-[1px] border-[#3c3c3c]  last-of-type:border-b-0 grid grid-cols-12 items-center col-end-13 row-span-2 ">
            <h3 className="text-xl text-[#3c3c3c] pl-5 font-semibold col-start-1 col-end-4">{cita.nombre}</h3>

            <div className="col-span-2 flex items-center gap-x-1">
                {
                    ServiciosData?.map((servicio,index) => <div key={index} className={`w-fit p-3 border-[1px] rounded-full ${getCatColors(servicio?.category!!)}`}/>)
                }
                
            </div>

            <h3 className="text-xl text-[#3c3c3c] font-semibold col-span-2">{cita.fecha} {cita.hora}</h3>

            <button 
            onClick={()=> handleClick()}
            className="col-span-2 col-start-11 col-end-13 mr-3 bg-blue-500 rounded-md text-white flex justify-center py-2 items-center">Pagar</button>
        </div>
    )
}

export default POVAgendadosDialog
