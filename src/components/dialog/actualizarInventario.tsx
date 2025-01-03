import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useRef, useState } from "react";
import WithLabel from '../inputs/withLabel.input';
import { CategoriaSvg, StockSvg, Trash } from "@/assets/svg";
import { useProductosStore } from "@/store/store";
import { getCatColors } from "@/funcs";
import { Product } from "@/types";
import { Formik, Form, Field } from 'formik';
import { updateStock } from "@/api/stock/stock.update";
import { Loader2 } from "lucide-react";

const TableCategories = [
    {
        name: 'Inventario',
        svg: null
    },
    {
        name: 'Categoria',
        svg: <CategoriaSvg />
    },
    {
        name: 'Stock',
        svg: <StockSvg className="stroke-[#3C3C3C]" />
    },
    {
        name: "opc",
        svg: null
    }
]

const ActualizarInventario = () => {
    const dialogRef = useRef<HTMLButtonElement>(null);

    const Products = useProductosStore((state) => state.productos)
    const cargarProduct = useProductosStore((state) => state.cargarProduct)

    const [SelectedProducts, setSelectedProducts] = useState<Product[]>([])
    const [FilteredSearchProducts, setFilteredSearchProducts] = useState<Product[]>([])
    const [searchInput, setsearchInput] = useState("")

    useEffect(() => {
        HandleSearch()
    }, [searchInput])

    const HandleSearch = () => {
        const filteredData = Products.filter(product =>
            product.name.toLowerCase().includes(searchInput.toLowerCase()) &&
            !SelectedProducts.includes(product)
        );
        setFilteredSearchProducts(filteredData);
    }

    const handleSubmit = async (values: { [key: string]: { stock: number } }) => {

        const UpdatedStock = SelectedProducts.map(product => ({
            cantidad: Number(values[product.id]),
            stockActualizado: Number(product.stock) - Number(values[product.id]),
            productoId: product.id,
            tipo: "venta"
        }))
        
        await Promise.all(UpdatedStock.map(stock => updateStock({ stock })));
        cargarProduct()
        dialogRef.current?.click()
    }

    return (
        <Dialog>
            <DialogTrigger ref={dialogRef} className="w-full border-[1px] border-[#3c3c3c] rounded-lg">
                <div className="px-4 h-14  text-[15px] flex justify-center items-center gap-x-1 rounded-lg ">
                    Actualizar Inventario
                </div>
            </DialogTrigger>
            <DialogContent className="w-[80%] h-[60%]">
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                    <Formik
                        initialValues={SelectedProducts.reduce((acc, product) => {
                            if (product.id) {
                                acc[product.id] = { stock: 0 }; // Solo almacenar el stock actualizado
                            }
                            return acc;
                        }, {} as { [key: string]: { stock: number } })} // Cambiar el tipo a un objeto con solo stock
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="w-full h-full grid grid-cols-12 grid-rows-6 gap-y-3">

                                <div className="col-start-10 col-end-13">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="w-full border-[1px] border-[#3c3c3c] rounded-lg py-3">Seleccionar Producto</DropdownMenuTrigger>
                                        <DropdownMenuContent className="max-w-[19vw] max-h-[40vh] overflow-y-auto">
                                            <WithLabel
                                                name="searchProduct"
                                                label="Productos"
                                                type="text"
                                                onChange={(e) => setsearchInput(e.target.value)}
                                                value={searchInput}
                                            />
                                            <DropdownMenuSeparator />
                                            {
                                                FilteredSearchProducts.map((product, index) => (
                                                    <DropdownMenuItem onClick={() => setSelectedProducts([...SelectedProducts, product])} key={index} className="grid grid-cols-5 mt-2 pr-10 pl-2">
                                                        <span className="col-span-3">{product.name}</span>
                                                        <span className="col-span-2  flex items-center">
                                                            <div className={`px-6 py-1.5 ${getCatColors(product.category)} rounded-full`}>
                                                                {product.category}
                                                            </div>
                                                        </span>
                                                    </DropdownMenuItem>
                                                ))
                                            }
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {/*  */}
                                </div>

                                <div className="col-start-1 col-end-13 row-start-2 row-end-6 grid-rows-5 grid grid-cols-12 place-content-start">
                                    {
                                        TableCategories.map((categorie, index) => (
                                            <>
                                                {index === 0 && (
                                                    <div className="col-start-1 col-end-4 flex text-[#3c3c3c] font-semibold items-center pl-10">
                                                        <span className="">{categorie.name}</span>
                                                    </div>
                                                )}
                                                {index === 1 && (
                                                    <div className="col-start-4 col-end-7 flex items-center gap-2 ">
                                                        <span className="text-[#3c3c3c] font-semibold">{categorie.svg}</span>
                                                        <h2 className="text-[#3c3c3c] font-semibold">{categorie.name}</h2>
                                                    </div>
                                                )}
                                                {index === 2 && (
                                                    <div className="col-start-7 col-end-10 flex items-center justify-center gap-2 ">
                                                        <span className="text-[#3c3c3c] font-semibold">{categorie.svg}</span>
                                                        <h2 className="text-[#3c3c3c] font-semibold">{categorie.name}</h2>
                                                    </div>
                                                )}
                                            </>

                                        ))
                                    }
                                    <div className="border-[1px] border-[#3c3c3c] max-h-[450px] rounded-lg w-full h-full col-start-1 col-end-13 row-start-2 overflow-y-auto row-end-6">
                                        {
                                            SelectedProducts.map((product, index) => <TableCell 
                                            key={index} 
                                            product={product} 
                                            onDelete={()=>setSelectedProducts(prev => prev.filter(p => p.id !== product.id))}
                                            />)
                                        }
                                    </div>
                                </div>

                                <div className="grid gap-x-3 grid-cols-12 col-start-1 col-end-13 row-start-6 row-end-7 w-full h-full">
                                    <button type="button" onClick={() => dialogRef.current?.click()} className="px-6 py-2 border-[1px] border-[#3c3c3c] rounded-lg col-start-9 col-end-11">Cancelar</button>
                                    <button type="submit" className="px-6 flex justify-center items-center py-2 bg-blue-500 text-white rounded-lg col-start-11 col-end-13">{isSubmitting ? <Loader2 className="size-5 animate-spin" /> : 'Actualizar'}</button>
                                </div>

                            </Form>
                        )}
                    </Formik>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

interface TableProps {
    product: Product,
    onDelete: ()=> void
}

const TableCell = ({ product,onDelete }: TableProps) => {
    return (
        <div className="py-3 border-b-[1px] grid grid-cols-12 border-[#3c3c3c] last-of-type:border-b-0">
            <h2 className="col-start-1 col-end-4 pl-10 text-[#3c3c3c] flex items-center font-semibold">
                {product.name}
            </h2>

            <span className="col-start-4 col-end-7 flex items-center">
                <div className={`px-6 py-1.5 ${getCatColors(product.category)} rounded-full`}>
                    {product.category}
                </div>
            </span>

            <span className="col-start-7 col-end-10 flex items-center justify-center">
                <div className="text-[#3c3c3c] font-semibold">
                    {product.stock}
                </div>
            </span>

            <div className="col-start-10 flex items-center gap-x-2 col-end-13 pr-5">
                <Field
                    name={product.id.toString()}
                    as={WithLabel}
                    label=""
                    type="number"
                    placeHolder={product.stock.toString()}
                />

                <button onClick={()=>onDelete()}><Trash className="size-5 stroke-red-500"/></button>
            </div>

        </div>
    )
}

export default ActualizarInventario
