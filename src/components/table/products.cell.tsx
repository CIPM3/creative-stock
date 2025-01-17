import { getCatColors } from "@/funcs"
import { Product } from "@/types"
import AgregarStock from "../dropdown/agregarStock.dialog"
import EditarProductoTable from "../dialog/editarProduct.dropdown"
import { useNavigate } from "react-router-dom"

interface TableCellProps {
    product: Product
}

const TableCell = ({ product }: TableCellProps) => {

    const navigate = useNavigate()


    return (
        <div
            key={product.id}
            className="grid grid-cols-12 w-full col-start-1 col-end-13 items-center border-b-[1px] border-[#707070] py-3">
            <div onClick={()=>navigate(`/productos/${product.id}`)} className="col-span-3 lg:col-span-2 xl:col-span-3 cursor-pointer text-xl pl-10 text-[#707070] font-semibold">
                {product.name}
            </div>
            <div className="col-span-2 flex text-sm">
                <span className={`border-[1px] ${getCatColors(product.category.toLocaleLowerCase())} px-4 py-2  rounded-full`}>
                    {product.category}
                </span>
            </div>
            <div className="col-span-1 justify-center flex text-xl">
                <span className={`${product.stock >= 10 ? "text-[#0077FF]" : "text-[#DD1313]"} font-semibold`}>
                    {product.stock}
                </span>
            </div>
            <div className="col-span-2 justify-center flex text-xl">
                <span className={`font-semibold`}>
                    {product.sells}
                </span>
            </div>
            <div className="col-span-1 justify-center flex text-xl">
                <span className={`font-semibold text-[#19AD0F]`}>
                    {/* ${product. || 1 * product.precio!!} */}
                </span>
            </div>
            <div className="col-span-3 lg:col-span-4 xl:col-span-3 pr-3  flex gap-x-1 items-center justify-end ">
                <AgregarStock product={product}/>
                <EditarProductoTable product={product}/>
            </div>
        </div>
    )
}

export default TableCell
