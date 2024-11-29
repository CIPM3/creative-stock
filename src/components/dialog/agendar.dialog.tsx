import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { RefObject, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { es } from "date-fns/locale"
import WithLabel from "../inputs/withLabel.input";
import SelectCustom from "../selects/SelectCustom";

interface AgendarDialogProps {
    dialogRef: RefObject<HTMLButtonElement>
}

const AgendarDialog = ({ dialogRef }: AgendarDialogProps) => {
    const [date, setDate] = useState<Date | undefined>(new Date())

    const [hora, sethora] = useState('AM')

    return (
        <Dialog key={'agendar dialog'}>
            <DialogTrigger className="hidden" ref={dialogRef}>Open</DialogTrigger>
            <DialogContent className="w-[70dvw] h-[70dvh] divide-x-[1px] divide-[#5e2727] flex gap-0 p-0 overflow-hidden">
                <div className="w-1/2  flex justify-center items-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        classNames={{
                            cell: "h-14 w-14 text-center text-sm rounded-md p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:text-white rounded-lg first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: "h-14 w-14 p-0 font-normal aria-selected:opacity-100",
                            head_cell: "text-muted-foreground rounded-md w-14 font-normal text-[0.8rem]",
                            day_selected:"bg-[#0077FF] rounded-lg",
                            day_today:"focus:text-white",
                            nav_button_next:"right-1 absolute border-0",
                            nav_button_previous:"left-1 absolute border-0",
                        }}
                        locale={es}
                    />
                </div>
                <div className="w-1/2 flex flex-col gap-5 justify-center items-center ">
                    <div className="flex items-center gap-5">
                        <WithLabel label="Nombre" name="nombre" type="text" />
                        <WithLabel label="Apellido" name="apellido" type="text" />
                    </div>
                    
                    <div className="w-[73%] ">
                    <SelectCustom
                        array={[
                            'unas',
                            'corte',
                            'labial',
                            'masaje'
                        ]}
                        placeHolder="Tipo de servicio"
                    />
                    </div>
                    <div className="w-[73%] flex justify-start items-center gap-3">
                        <WithLabel placeHolder="00:00" className="w-24 ring-0 ring-offset-0 placeholder:font-bold placeholder:text-xl" label="Hora" name="hora" type="text" />
                        
                        <div className=" h-fit mt-auto divide-x divide-[#707070]">
                            <button 
                            onClick={()=>sethora('AM')} 
                            className={`w-16 h-10 transition-all border-t border-l border-b ${hora === "AM" ? "bg-[#D8E5F3] text-[#336EB1] border-[#336EB1]" : "text-[#707070] border-[#554747] bg-[#EAEAEA]"}  rounded-l-lg`}>AM</button>
                            <button 
                            onClick={()=>sethora('PM')} 
                            className={`w-16 h-10 transition-all border-t border-r border-b ${hora === "PM" ? "bg-[#D8E5F3] text-[#336EB1] border-[#336EB1]" : "text-[#707070] border-[#554747] bg-[#EAEAEA]"}  rounded-r-lg`}>PM</button>
                        </div>
                    </div>

                    <div className="w-[73%] flex justify-end">
                        <button className="py-2 px-8 rounded-lg text-white font-light bg-[#0077FF]">Agendar</button>
                    </div>


                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AgendarDialog
