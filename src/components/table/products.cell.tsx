import { getCatColors } from "@/funcs"
import { Product } from "@/types"
import AgregarStock from "../dropdown/agregarStock.dialog"
import EditarProductoTable from "../dialog/editarProduct.dropdown"

interface TableCellProps {
    product: Product
}

const TableCell = ({ product }: TableCellProps) => {
    return (
        <div
            key={product.id}
            className="grid grid-cols-8 w-full col-start-1 col-end-9 items-center border-b-[1px] border-[#707070] py-2">
            <div className="col-start-1 text-xl col-end-3 pl-20 text-[#707070] font-semibold">
                {product.name}
            </div>
            <div className="col-start-3 text-sm">
                <span className={`border-[1px] ${getCatColors(product.category.toLocaleLowerCase())} px-4 py-2  rounded-full`}>
                    {product.category}
                </span>
            </div>
            <div className="col-start-4 text-xl">
                <span className={`${product.stock >= 10 ? "text-[#0077FF]" : "text-[#DD1313]"} font-semibold`}>
                    {product.stock}
                </span>
            </div>
            <div className="col-start-5 text-xl">
                <span className={`font-semibold`}>
                    {product.sells}
                </span>
            </div>
            <div className="col-start-6 text-xl">
                <span className={`font-semibold text-[#19AD0F]`}>
                    ${product.incomes}
                </span>
            </div>
            <div className="col-start-7 col-end-9 flex gap-x-1 items-center justify-end pr-5">
                <AgregarStock/>
                <EditarProductoTable product={product}/>
            </div>
        </div>
    )
}

export default TableCell
