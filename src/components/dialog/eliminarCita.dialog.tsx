import { Trash } from "@/assets/svg";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const EliminarCitaDialog = () => {

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
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">

                </div>
                <DialogFooter>
                    <button type="submit">Save changes</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EliminarCitaDialog
