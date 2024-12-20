import { getCatColors, handleStock } from "@/funcs"
import { useStore } from "@/store/store"
import { Product } from "@/types"
import { useEffect, useState } from "react"

interface Props {
    firstText?: string
    secondText?: string
    product: Product,
    type:'stock'|'salida'
}

const ProductTable = ({ product, firstText, secondText,type }: Props) => {

    const stocks = useStore((state) => state.stock)
    const cargarStock = useStore((state) => state.cargarStock)
    const [isLoading, setisLoading] = useState(false)


    useEffect(() => {
        setisLoading(true)
        cargarStock()
        setisLoading(false)
    }, [])


    const filteredStock = handleStock(stocks, product)


    return (
        <div className="w-full mt-12">
            <div className="w-full flex justify-center gap-x-6 mb-5 items-center">
                <span className="text-[#3C3C3C] font-semibold">{firstText}</span>
                <span className="text-[#3C3C3C] font-semibold">{secondText}</span>
            </div>

            <div className="w-full border-[1px] border-[#707070] rounded-lg">
                {/* Handle different states: loading, error, and success */}
                {isLoading ? (
                    <div className="p-4 text-center">
                        <p>Loading stock data...</p>
                    </div>
                ) : stocks ? (
                    <>
                        {
                            filteredStock.map((stock,index) => (
                                <TableCellProduct
                                    key={index}
                                    producto={{
                                        name: product.name,
                                        category: product.category,
                                        fecha: stock.date,
                                        id: stock.productID,
                                        stockEntrada: stock.entradaDeStock,
                                        stockSalida: stock.salidaDeStock
                                    }}
                                    type={type}
                                />
                            ))
                        }
                    </>
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        <p>No stock data available.</p>
                    </div>
                )}
            </div>
        </div>
    )
}



interface PropsTable {
    producto: {
        name: string,
        category: string,
        stockEntrada: number,
        stockSalida: number,
        fecha: string,
        id: string
    }
    type?: 'stock' | 'salida'
}

const TableCellProduct = ({ producto, type }: PropsTable) => {
    const precios = useStore((state) => state.precios)
    const cargarPrecios = useStore((state) => state.cargarPrecios)


    useEffect(() => {
        cargarPrecios()
    }, [])

    const precioProduct = precios.find((price)=> price.productId === producto.id)


    return (
        <div
            key={producto.id}
            className="grid grid-cols-8 w-full col-start-1 col-end-9 items-center  border-b-[1px] last-of-type:border-b-0 border-[#707070] py-5">
            <div onClick={() => { }} className="col-start-1 cursor-pointer text-xl col-end-3 pl-20 text-[#707070] font-semibold">
                {producto.name}
            </div>
            <div className="col-start-3 col-end-4 text-sm">
                <span className={`border-[1px] ${getCatColors(producto.category.toLocaleLowerCase()!!)} px-4 py-2  rounded-full`}>
                    {producto.category}
                </span>
            </div>
            <div onClick={() => { }} className={`col-start-4 text-center cursor-pointer text-lg col-end-5  ${type === "stock" ? "text-[#19AD0F]" : "text-[#0077FF]"}  font-semibold`}>
                +{producto.stockEntrada}
            </div>
            <div onClick={() => { }} className="col-start-5 text-center cursor-pointer text-lg col-end-6 text-[#DD1313] font-semibold">
                {
                    type == "stock" && <>-{producto.stockSalida}</>
                }
                {
                    type == "salida" && <>${producto.stockSalida * precioProduct?.precioCompra!!}</>
                }
                {/* -{type !== "stock" && '$'}{producto.stockSalida} */}
            </div>
            <div onClick={() => { }} className="col-start-6 text-end cursor-pointer text-lg col-end-8 text-[#707070] font-light">
                {producto.fecha?.split(" ")[0]}
            </div>
            <div onClick={() => { }} className="col-start-8 text-center cursor-pointer text-lg col-end-9 text-[#707070] font-semibold">
                {producto.fecha?.split(" ")[1]} {producto.fecha?.split(" ")[2]}
            </div>
        </div>
    )
}

export default ProductTable
