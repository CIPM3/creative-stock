import { Arrow, Edit } from "@/assets/svg"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Formik, Form } from 'formik';

import { Product } from "@/types"
import { Loader2, Trash } from "lucide-react"
import WithLabel from "../inputs/withLabel.input"
import { useRef, useState } from "react"
import { getCatColors } from "@/funcs"
import { GIVProducts, VSProducts } from "@/libs/formik.validation";
import { useStore } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import { updateProduct } from "@/api/productos/productos.update";
import { deleteProduct } from "@/api/productos/producto.delete";

interface Props {
    type: string,
    product: Product,
    onClick: () => void
}

const EditDeleteDialog = ({ type, product }: Props) => {

    const categories = [
        'cabello',
        'uñas',
        'maquillaje',
        'otros'
    ]

    const [selectedItem, setselectedItem] = useState<string | null>(product.category)
    const [date] = useState<Date | undefined>(new Date())
    const [loading, setLoading] = useState(false);
    const dialogRef = useRef<HTMLButtonElement>(null);

    const editarProducto = useStore((state) => state.actualizarProduct)
    const eliminarProducto = useStore((state) => state.eliminarProduct)

    const mutationUpdate = useMutation<Product, Error, Product>({
        mutationFn: (finalData) => updateProduct(product.id,finalData)
    });

    const mutationDelete = useMutation<Product | null, Error, Product>({
        mutationFn: (finalData: Product) => deleteProduct(finalData.id).then(() => {
            return null; // O retornar un objeto que cumpla con Product si es necesario
        })
    });

    const handleSubmit = async (values: any) => {
        setLoading(true)
        if (type === "editar") {
            editarProducto(values)
            mutationUpdate.mutateAsync(values)
        }

        if (type === "eliminar") {
            mutationDelete.mutateAsync(product)
            eliminarProducto(product.id)
        }
        dialogRef.current?.click()
        setLoading(false)
    }

    return (
        <Dialog>
            <DialogTrigger ref={dialogRef} className="outline-none">
                {type === "editar" && (
                    <div
                        className="flex items-center px-4 py-2 gap-x-1 text-sm">
                        <Edit className="size-4" /> Editar
                    </div>)}
                {type === "eliminar" && (
                    <div
                        className="flex items-center px-4 py-2 gap-x-1 text-red-500 text-sm">
                        <Trash className="size-4" /> Eliminar
                    </div>)}
            </DialogTrigger>
            <DialogContent className="w-1/3">
                <Formik
                    initialValues={GIVProducts(date, product)}
                    validationSchema={VSProducts}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, errors }) => (
                        <Form className="my-8">
                            <WithLabel
                                className={`${errors.name && 'border-red-500'} mb-3`}
                                onChange={(e) => setFieldValue('name', e.target.value)}
                                label="Nombre del producto"
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
                                                    <span className={`text-sm font-light border-[1px] ${getCatColors(selectedItem!!)} px-6 py-1 rounded-full`}>
                                                        {selectedItem!!}
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
                                                <span className={`text-sm font-light border-[1px] ${getCatColors(categorie)} px-6 flex items-center justify-center py-1 rounded-full`}>
                                                    {categorie}
                                                </span>
                                            </DropdownMenuItem>
                                        ))
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="w-full flex mt-5 items-center gap-x-1 justify-start">
                                <div className="w-1/4">
                                    <WithLabel
                                        label={'Stock'}
                                        name="currentStock"
                                        type="number"
                                        placeHolder={product.stock.toString()}
                                        className=" bg-[#EAEAEA]"
                                    />
                                </div>
                                <div className="w-1/4">
                                    <WithLabel
                                        className={`${errors.stock && 'border-red-500'} mt-5`}
                                        onChange={(e) => setFieldValue('stock', e.target.value)}
                                        label=""
                                        name="stock"
                                        type="number"
                                        value={values.stock.toString()}
                                    />
                                </div>

                            </div>

                            <div className="w-full flex justify-end">
                                {type === "eliminar" && (
                                    <button type="submit" className="px-6 py-2 text-red-500 flex items-center gap-x-1">
                                        <Trash className="size-4 text-red-500" />
                                        {loading ? <Loader2 className="size-3 animate-spin" /> : "Eliminar"}
                                    </button>)}
                                {type === "editar" && (
                                    <button disabled={loading} type="submit" className="px-6 py-2 text-[#0077FF] border-[1px] border-[#0077FF] rounded-lg">
                                        {loading ? <Loader2 className="size-3 animate-spin" /> : "Actualizar"}

                                    </button>)}
                            </div>
                        </Form>
                    )}

                </Formik>
            </DialogContent>
        </Dialog>

    )
}

export default EditDeleteDialog
