import SearchInput from "@/components/inputs/search.input"
import { ProductsTable } from "@/components/table/products.table"
import { useStore } from "@/store/store"

const Productos = () => {

  const searchInputProduct = useStore((state)=> state.searchInputProduct)

  return (
    <div className="w-full min-h-[90dvh]  ">
      <div className="flex items-center px-[70px] pt-[37px] pb-6 justify-between">
        <div className="flex flex-col w-1/2 ">
          <h2 className="text-4xl font-semibold text-[#3C3C3C]">Productos</h2>
          
        </div>

        <div className="flex flex-col w-1/2 overflow-hidden relative items-end">
          <SearchInput onChange={(e) => {
            // Aquí tu lógica de búsqueda
            searchInputProduct(e.target.value)
          }} />
        </div>
      </div>

      <div className="flex flex-col justify-center px-[70px] ">
          <ProductsTable/>
      </div>
    </div>
  )
}

export default Productos
