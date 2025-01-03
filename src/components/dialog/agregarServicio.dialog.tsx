import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Plus } from "lucide-react"

import { Formik, Form } from 'formik';
import { GIVServicios, VSServicios } from "@/libs/formik.validation";
import WithLabel from "../inputs/withLabel.input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Arrow } from "@/assets/svg";
import { obtenerIconoServicio } from "@/funcs";
import { useRef, useState } from "react";
import { useCitasStore, useServiciosStore } from "@/store/store";
import { agregarServicioDb } from "@/api/servicios/servicios.add";
import { toast } from "@/hooks/use-toast";


const AgregarServicio = () => {

    const citas = useCitasStore((state)=> state.citas)
    const cargarCitas = useCitasStore((state)=> state.cargarCitas)
    const agregarServicio = useServiciosStore((state)=>state.agregarServicio)

    const categories = [
        'corte',
        'unas',
        'labial',
        'masaje'
    ]

    const getNameOfCat = (cat: string) => {
        if (cat === 'unas') return 'Uñas'
        if (cat === 'corte') return 'Cabello'
        if (cat === 'labial') return 'Maquillaje'
        if (cat === 'masaje') return 'Masaje'
    }

    const [selectedItem, setselectedItem] = useState<string | null>(null)
    const dialogRef = useRef<HTMLButtonElement | null>(null);

    const handleSubmit = async (values: any) => {
        cargarCitas()
        const cantidadDeCitas = citas.filter(cita => 
            Array.isArray(cita.servicios) && cita.servicios.includes(values.category)
        )
        
        let nuevoServicio = {
            ...values,
            agendados: cantidadDeCitas.length,
            total: Number(values.total)
        }
        agregarServicio(nuevoServicio)
        await agregarServicioDb(nuevoServicio)
        
        dialogRef.current?.click()

        toast({
            title: "Éxito",
            description: "Servicio agregado con éxito!"
        });
    }


    return (
        <Dialog key={`Agregar Servicio`}>
            <DialogTrigger ref={dialogRef} className="px-4 h-14 w-full text-lg flex justify-center items-center gap-x-1 rounded-lg text-white bg-[#0077FF]">
                <Plus className="size-4 text-white" />
                Agregar Servicio
            </DialogTrigger>
            <DialogContent className="w-1/2">
                <Formik
                    initialValues={GIVServicios()}
                    validationSchema={VSServicios}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, errors,isSubmitting }) => (
                        <Form className="w-full flex justify-center gap-y-3 flex-col px-[20%] py-4">
                            <WithLabel
                                className={`${errors?.name && 'border-red-500'}`}
                                onChange={(e) => setFieldValue('name', e.target.value)}
                                label="Nombre del Servicio"
                                name="name"
                                type="text"
                                value={values.name}
                            />

                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-full items-center justify-start">
                                    <div className={`w-full border-[1px] px-2 flex items-center justify-between ${errors.category ? "border-red-500" : "border-[#707070]"} rounded-lg py-1.5`}>
                                        {
                                            selectedItem === null
                                                ?
                                                (
                                                    <span className="p-1 text-sm font-light">Categoria</span>
                                                )
                                                :
                                                (
                                                    <span className={`text-sm font-light flex items-center gap-x-2 px-6 py-1 rounded-full`}>
                                                        <img className="size-5" src={`${obtenerIconoServicio(selectedItem!!)}`} alt={`${selectedItem!!}`} />
                                                        {
                                                            getNameOfCat(selectedItem)
                                                        }
                                                    </span>
                                                )
                                        }


                                        <Arrow className="size-3 fill-[#707070]" />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="flex flex-col gap-2 p-2">
                                    {
                                        categories.map((categorie, index) => (
                                            <DropdownMenuItem onClick={() => {
                                                setselectedItem(categorie)
                                                setFieldValue('category', categorie)
                                            }} key={index}>
                                                <span className={`text-sm  font-light px-6 flex gap-x-2 items-center justify-center py-1 rounded-full`}>

                                                    <img className="size-5" src={`${obtenerIconoServicio(categorie)}`} alt={`${categorie}`} />
                                                    {
                                                        getNameOfCat(categorie)
                                                    }
                                                </span>
                                            </DropdownMenuItem>
                                        ))
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <WithLabel
                                placeHolder={`$ ${values.total}`}
                                className="w-full max-w-[180px] ring-0 ring-offset-0 placeholder:font-bold placeholder:text-sm"
                                label="Precio"
                                name="total"
                                type="text"
                                onChange={(e) => setFieldValue("total",e.target.value)}
                                value={values.total.toString()}
                            />

                            <button type="submit" className="w-fit ml-auto py-3 px-6 bg-[#0077FF] text-white rounded-lg">
                                {
                                    isSubmitting ? <Loader2 className="size-3 animate-spin"/> : 'Agregar Servicio'
                                }
                                
                            </button>
                        </Form>
                    )}

                </Formik>
            </DialogContent>
        </Dialog>

    )
}

export default AgregarServicio
