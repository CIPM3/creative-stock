import { deleteCita } from "@/api/citas/citas.delete";
import { Trash } from "@/assets/svg";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useCitasStore } from "@/store/store";
import { Cita } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";

interface Props{
    cita:Cita
}

const EliminarCitaDialog = ({cita}:Props) => {
    
    const dialogRef = useRef<HTMLButtonElement>(null);
    const [loading, setLoading] = useState(false);

    const eliminarCita = useCitasStore((state) => state.eliminarCita)


    const mutationDelete = useMutation({
        mutationFn: () => {
            return deleteCita(cita.id!!);
        }
    });
    
    const handleDelete = async () => {
        setLoading(true);
        await mutationDelete.mutateAsync();
        eliminarCita(cita.id!!)
        setLoading(false)
        toast({
            title: "Éxito",
            description: "Cita cancelada con éxito!"
        });
        dialogRef.current?.click()

    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="w-full flex cursor-pointer items-center py-1.5 gap-2">
                    <Trash className="size-4 stroke-[#DD1313]" />
                    <p className="font-light text-[#DD1313] text-xs first-letter:uppercase">Cancelar cita</p>

                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-red-500">Cancelar Cita</DialogTitle>
                    <DialogDescription>
                        Estas seguro? estos cambios son irreversibles.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">

                </div>
                <DialogFooter className="flex items-center gap-3">
                    <DialogClose ref={dialogRef}>
                        <button 
                        className="border border-red-500 py-2 px-4 rounded-lg
                         text-red-500 hover:bg-red-500 transition-all hover:text-white" 
                        type="submit">Cancelar</button>
                    </DialogClose>
                    <button 
                    onClick={() => { handleDelete() }} 
                    type="submit"
                    className="py-2 px-4 rounded-lg bg-red-500
                     text-white border border-red-500 hover:bg-white transition-all hover:text-red-500"
                    >{loading ? 'Cargando...' : 'Confirmar'}</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EliminarCitaDialog
