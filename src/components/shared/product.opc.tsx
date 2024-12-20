import { Product } from "@/types"
import ProductTable from "../table/product.table"
import ProductAnalitica from "./product.analitica"

interface Props {
    type: 'stock' | 'ventas' | 'salida' | 'analitica',
    product: Product
}

const ProductOpc = ({ type, product }: Props) => {
    return (
        <div>
            {type === "stock" && (
                <ProductTable
                    product={product}
                    firstText="Stock Añadido"
                    secondText="Stock Vendido" 
                    type={type}
                    />)}
            {
                type === "analitica" && (
                    <ProductAnalitica/>
                )
            }
            {type === "salida" && (
                <ProductTable
                    product={product}
                    firstText="Reestock"
                    secondText="Salida" 
                    type={type}
                    />)}
        </div>
    )
}


export default ProductOpc
