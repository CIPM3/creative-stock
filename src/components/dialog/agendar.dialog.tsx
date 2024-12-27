import { Formik, Form } from 'formik';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { RefObject, useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { es } from "date-fns/locale"
import WithLabel from "../inputs/withLabel.input";
import SelectCustom from "../selects/SelectCustom";
import { validationSchema, getInitialValues } from '@/libs/formik.validation';
import { useMutation } from '@tanstack/react-query';
import { createCita } from '@/api/citas/citas.create'
import { CitaInput, CitasMethod,Servicio } from '@/types';
import { useCitasStore, useServiciosStore } from '@/store/store';
import { toast } from "@/hooks/use-toast"
import { updateCita } from '@/api/citas/citas.update';

interface AgendarDialogProps {
    dialogRef: RefObject<HTMLButtonElement>
}

interface UpdateParams {
    id: string;
    data: CitaInput;
}

const AgendarDialog = ({ dialogRef }: AgendarDialogProps) => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [hora, sethora] = useState('AM')

    const [loading, setLoading] = useState(false);

    const agregarCita = useCitasStore((state) => state.agregarCita)
    const selectedCita = useCitasStore((state) => state.selectedCita)
    const citasMethod = useCitasStore((state) => state.citasMethod)
    const cambiarCitasMethod = useCitasStore((state) => state.cambiarCitasMethod)
    const seleccionarCita = useCitasStore((state) => state.seleccionarCita)
    const actualizarCita = useCitasStore((state) => state.actualizarCita)

    const [ServicioByCita, setServicioByCita] = useState<Servicio[]>([])
    const seriviciosByCita = useServiciosStore((state)=>state.getServiciosByCita)

    useEffect(() => {
        setServicioByCita(seriviciosByCita(selectedCita?.servicios!!)) 
    }, [])
    

    const mutation = useMutation<CitaInput, Error, CitaInput>({
        mutationFn: (finalData) => createCita(finalData)
    });

    const mutationUpdate = useMutation<CitaInput, Error, UpdateParams>({
        mutationFn: ({ id, data }) => updateCita(id, data)
    });

    const handleSubmit = async (values: any) => {
        setLoading(true);
        let FinalData = {
            nombre: values.nombre + " " + values.apellido,
            servicios: values.servicios,
            hora: values.hora + " " + hora,
            total: values.total,
            fecha: values.fecha
        }

        if (citasMethod === CitasMethod.CREAR) {
            await mutation.mutateAsync(FinalData);
            agregarCita({
                nombre: values.nombre + " " + values.apellido,
                servicios: values.servicios.map((servicio:Servicio)=>servicio.id),
                hora: values.hora + " " + hora,
                total: Number(values.total),
                fecha: values.fecha
            });
            toast({
                title: "Éxito",
                description: "Cita agendada con éxito!"
            });
        }
        if (citasMethod === CitasMethod.REPROGRAMAR) {
            await mutationUpdate.mutateAsync({ id: selectedCita?.id || '', data: FinalData });
            actualizarCita({
                id: selectedCita?.id,
                ...FinalData
            })
            seleccionarCita(null)
            toast({
                title: "Éxito",
                description: "Cita reprogramada con éxito!"
            });
        }
        if (citasMethod === CitasMethod.ACTUALIZAR) {
            await mutationUpdate.mutateAsync({ id: selectedCita?.id || '', data: FinalData });
            actualizarCita({
                id: selectedCita?.id,
                ...FinalData
            })
            seleccionarCita(null)
            seleccionarCita(null)
            toast({
                title: "Éxito",
                description: "Cita editada con éxito!"
            });
        }

        setLoading(false);
        cambiarCitasMethod(CitasMethod.CREAR);
        dialogRef.current?.click();
    }

    return (
        <Dialog key={'agendar dialog'}>
            <DialogTrigger className="hidden" ref={dialogRef}>Open</DialogTrigger>
            <DialogContent className="w-[70dvw] h-[70dvh] divide-x-[1px] divide-[#5e2727] flex gap-0 p-0 overflow-hidden">
                <Formik
                    initialValues={getInitialValues(date, selectedCita || undefined)}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, errors }) => (
                        <Form className='flex w-full'>
                            <div className="w-1/2  flex justify-center items-center">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(selectedDate) => {
                                        setDate(selectedDate)
                                        const formattedDate = selectedDate ?
                                            `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear().toString().slice(-2)}`
                                            : undefined;
                                        setFieldValue('fecha', formattedDate)
                                    }}
                                    classNames={{
                                        cell: "h-14 w-14 text-center text-sm rounded-md p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:text-white rounded-lg first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                        day: "h-14 w-14 p-0 font-normal aria-selected:opacity-100",
                                        head_cell: "text-muted-foreground rounded-md w-14 font-normal text-[0.8rem]",
                                        day_selected: "bg-[#0077FF] rounded-lg",
                                        day_today: "focus:text-white",
                                        nav_button_next: "right-1 absolute border-0",
                                        nav_button_previous: "left-1 absolute border-0",
                                    }}
                                    locale={es}
                                />
                            </div>
                            <div className="w-1/2 flex flex-col gap-5 justify-center items-center ">
                                <div className="w-[73%] flex justify-start items-center gap-3">
                                    <WithLabel
                                        className={`${errors.nombre && 'border-red-500'}`}
                                        onChange={(e) => setFieldValue('nombre', e.target.value)}
                                        label="Nombre"
                                        name="nombre"
                                        type="text"
                                        value={values.nombre}
                                    />
                                    <WithLabel
                                        className={`${errors.apellido && 'border-red-500'}`}
                                        onChange={(e) => setFieldValue('apellido', e.target.value)}
                                        label="Apellido"
                                        name="apellido"
                                        type="text"
                                        value={values.apellido}
                                    />
                                </div>

                                <div className="w-[73%] ">
                                    <SelectCustom
                                        setFieldValue={setFieldValue}
                                        serviciosExistentes={ServicioByCita}
                                        value={ServicioByCita}
                                    />

                                </div>
                                <div className="w-[73%] flex justify-start items-center gap-3">
                                    <WithLabel
                                        onChange={(e) => setFieldValue('hora', `${e.target.value}`)}
                                        placeHolder="00:00"
                                        className={`w-full ${errors.hora && 'border-red-500'} ring-0 ring-offset-0 placeholder:font-bold font-bold text-xl placeholder:text-xl`}
                                        label="Hora"
                                        name="hora"
                                        type="text"
                                        value={values.hora}
                                    />

                                    <div className="w-fit h-fit flex mt-auto items-end">
                                        <span
                                            onClick={() => sethora('AM')}
                                            className={`w-16 h-10 cursor-pointer transition-all border-t flex items-center justify-center border-l border-b ${hora === "AM" ? "bg-[#D8E5F3] text-[#336EB1] border-[#336EB1]" : "text-[#707070] border-[#554747] bg-[#EAEAEA]"}  rounded-l-lg`}>
                                            AM
                                        </span>

                                        <span
                                            onClick={() => sethora('PM')}
                                            className={`w-16 h-10 cursor-pointer flex items-center justify-center border-l border-l-[#707070] transition-all border-t border-r border-b ${hora === "PM" ? "bg-[#D8E5F3] text-[#336EB1] border-[#336EB1]" : "text-[#707070] border-[#554747] bg-[#EAEAEA]"}  rounded-r-lg`}>
                                            PM
                                        </span>
                                    </div>

                                    <WithLabel
                                        placeHolder={`$ ${values.total}`}
                                        className="w-full max-w-[100px] ring-0 ring-offset-0 placeholder:font-bold placeholder:text-xl"
                                        label="Total"
                                        name="total"
                                        type="text"
                                        value={values.total}
                                        disabled
                                    />
                                </div>

                                <div className="w-[73%] flex justify-end">
                                    <button
                                        type='submit'
                                        className="py-2 px-8 rounded-lg text-white font-light bg-[#0077FF]"
                                        disabled={loading}
                                    >
                                        {loading ? 'Cargando...' : 'Agendar'}
                                    </button>
                                </div>

                            </div>
                        </Form>
                    )}

                </Formik>
            </DialogContent>
        </Dialog>
    )
}

export default AgendarDialog
