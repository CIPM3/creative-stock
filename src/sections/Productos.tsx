import SearchInput from "@/components/inputs/search.input"
import { ProductsTable } from "@/components/table/products.table"
import { useProductosStore } from "@/store/store"
import { useState, useEffect } from "react"

const Productos = () => {
  const [loading, setLoading] = useState(true)
  const searchInputProduct = useProductosStore((state) => state.searchInputProduct)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="w-full min-h-[90dvh]">
      <div className="flex items-center lg:px-[30px] xl:px-[70px] pt-[37px] pb-6 justify-between">
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

      <div className="flex flex-col justify-center lg:px-[30px] xl:px-[70px] ">
        <ProductsTable loading={loading} />
      </div>
    </div>
  )
}

export default Productos
