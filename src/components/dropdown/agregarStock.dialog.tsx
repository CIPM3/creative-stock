import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import WithLabel from "../inputs/withLabel.input"
import { DialogClose } from "@radix-ui/react-dialog"


const AgregarStock = () => {
    return (
        <Dialog key={'agregarStock'}>
            <DialogTrigger asChild>
                <button className="px-6 py-3 border-[1px] gap-x-1 border-[#0077FF] font-semibold flex items-center rounded-lg text-[#0077FF]">
                    <Plus className="text-[#0077FF] size-4 font-bold" />
                    Agregar stock
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="w-full flex justify-center">
                        <h2 className="text-2xl font-bold text-[#3C3C3C]">Agregar Stock</h2>
                    </div>
                    <div className="w-1/2 mx-auto">
                        <WithLabel
                            label="stock"
                            name="stock"
                            type="number"
                            placeHolder="ej: 100"
                        />

                        <DialogClose className="w-full">
                            <button className="w-full font-light bg-[#0077FF] text-white rounded-lg mt-3 py-2" type="submit">
                                Agregar
                            </button>
                        </DialogClose>
                    </div>

                </div>
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AgregarStock
