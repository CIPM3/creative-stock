import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Plus } from "lucide-react"
import WithLabel from "../inputs/withLabel.input"

import { Formik, Form } from 'formik';
import { GIVProducts, VSProducts } from "@/libs/formik.validation";
import { useRef, useState } from "react";
import { Product } from "@/types";
import { useStore } from "@/store/store";
import { addStockTransaction } from "@/api/stock/stock.add";

interface Props {
    product: Product
}

const AgregarStock = ({product}:Props) => {

    const [date] = useState<Date | undefined>(new Date())
    const dialogRef = useRef<HTMLButtonElement>(null);
    const [loading, setloading] = useState(false)

    const actualizarProduct = useStore((state)=>state.actualizarProduct)

    const handleSubmit = async (values: any) => {
        setloading(true)
        let oldStock = Number(product.stock)
        let addToStock = Number(values.stock)

        let actualStock = oldStock + addToStock

        let updatedData = {
            ...values,
            stock: actualStock
        }
        //alert(JSON.stringify(updatedData))
        
        actualizarProduct(updatedData)
        await addStockTransaction({productId: product.id,cantidadAAgregar:addToStock,cantidadActual:actualStock.toString()})
        dialogRef.current?.click()
        setloading(false)
    }

    return (
        <Dialog key={'agregarStock'}>
            <DialogTrigger ref={dialogRef} asChild>
                <span className="px-6 py-3 border-[1px] gap-x-1 border-[#0077FF] font-semibold flex items-center rounded-lg text-[#0077FF]">
                    <Plus className="text-[#0077FF] size-4 font-bold" />
                    Agregar stock
                </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <Formik
                    initialValues={GIVProducts(date,product)}
                    validationSchema={VSProducts}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, errors }) => (
                        <Form className="grid gap-4 py-4">
                            <div className="w-full flex justify-center">
                                <h2 className="text-2xl font-bold text-[#3C3C3C]">Agregar Stock</h2>
                            </div>
                            <div className="w-1/2 mx-auto">
                                <WithLabel
                                    className={`${errors.stock && 'border-red-500'}`}
                                    onChange={(e) => setFieldValue('stock', e.target.value)}
                                    label="stock"
                                    name="stock"
                                    type="number"
                                    placeHolder="ej: 100"
                                />

                                <button className="w-full font-light flex justify-center items-center bg-[#0077FF] text-white rounded-lg mt-3 py-2" type="submit">
                                    
                                    {
                                        loading ? <Loader2 className="size-4 animate-spin"/> : "Agregar"
                                    }
                                </button>
                            </div>

                        </Form>
                    )}

                </Formik>

                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AgregarStock
