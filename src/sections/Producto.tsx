import { Entradas, Filter, StockSvg, VentasSvg } from "@/assets/svg"
import EditarProductoTable from "@/components/dialog/editarProduct.dropdown"
import AgregarStock from "@/components/dropdown/agregarStock.dialog"
import { formatDate, getCatColors } from "@/funcs"
import { useProductosStore, useStockStore } from "@/store/store"
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"

import NavButton from '@/components/ui/navButton';
import ProductOpc from '../components/shared/product.opc';
import { Stats, Stock } from "@/types"


const Producto = () => {

    const { id } = useParams()
    const selectProduct = useProductosStore((state) => state.selectProducto)
    const selectedProduct = useProductosStore((state) => state.selectedProduct)
    const date = formatDate(new Date())

    const stock = useStockStore((state) => state.stock)
    const cargarStock = useStockStore((state) => state.cargarStock)

    const [selectedField, setselectedField] = useState(0)

    const [stats, setStats] = useState<Stats>({
        ventasDelDia: 0,
        ventasDelMes: 0,
        salidasDelDia: 0,
        salidasDelMes: 0,
      });
    const [VENTAS_DEL_DIA, setVENTAS_DEL_DIA] = useState(0)
    const [SALIDAS_MES, setSALIDAS_MES] = useState(0)

    useEffect(() => {
        cargarStock();
    }, [])
    

    useEffect(() => {
        selectProduct(id!!)
        setStats(handleStockProduct(stock, new Date(), id!!))
    }, [id])

    useEffect(() => {
        if (!selectedProduct) return
      
        // Ventas del día en dinero
        setVENTAS_DEL_DIA(
          stats.ventasDelDia * selectedProduct.precio!!
        )
      
        // Ventas del mes en dinero (si quisieras mostrarlo)
        // setVENTAS_DEL_MES(
        //   stats.ventasDelMes * selectedProduct.precio
        // )
      
        // Entradas del día/mes en dinero, según la lógica
        setSALIDAS_MES(
          stats.salidasDelMes * selectedProduct.precio!!
        )
      }, [stats, selectedProduct])
      
    

    const handleStockProduct = (transacciones: Stock[], date: Date, productId: string) => {
  const hoy = date;
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  let ventasDelDia = 0;
  let ventasDelMes = 0;
  let salidasDelDia = 0;
  let salidasDelMes = 0;

  transacciones
    .filter(transaccion => transaccion.productoId === productId)
    .forEach(transaccion => {
      const fechaTransaccion = transaccion.fecha.split(" ")[0];
      const [dia, mes, año] = fechaTransaccion.split("/").map(Number);
      const fechaTransaccionDate = new Date(año + 2000, mes - 1, dia);

      const esHoy = fechaTransaccionDate.toDateString() === hoy.toDateString();
      const esEsteMes = fechaTransaccionDate >= inicioMes;

      if (transaccion.tipo === "venta") {
        // "venta" => ¿salida de stock?
        if (esHoy) ventasDelDia += transaccion.cantidad;
        if (esEsteMes) ventasDelMes += transaccion.cantidad;
      } else if (transaccion.tipo === "compra") {
        // "compra" => ¿entrada de stock?
        if (esHoy) salidasDelDia += transaccion.cantidad;
        if (esEsteMes) salidasDelMes += transaccion.cantidad;
      }
    })

  return { ventasDelDia, ventasDelMes, salidasDelDia, salidasDelMes };
}


    return (
        <div className="w-full min-h-[90dvh]">
            <div className="flex flex-col justify-centers lg:px-[30px] xl:px-[70px] pt-[37px] pb-6 justify-between">

                {/* PRODUCTO HEADER */}
                <div className="flex flex-col w-1/2 ">
                    <h2 className="text-4xl font-semibold text-[#3C3C3C]">Productos</h2>
                </div>

                {/* PRODUCTO OPC */}
                <div className="flex items-center justify-between my-2">
                    <div className="flex items-center gap-x-2 text-xl font-light">
                        <span className="text-[#3C3C3C]">
                            Producto
                        </span>
                        <span className="text-[#3C3C3C]">{">"}</span>
                        <span className="text-[#0077FF]">{selectedProduct?.name}</span>
                    </div>
                    <div className="flex items-center gap-x-4">
                        <div className="flex items-center gap-x-2">
                            <span className="text-lg text-[#3C3C3C] font-semibold">Categoria:</span>
                            <span className={`px-6 py-1.5 border-[1px] ${getCatColors(selectedProduct?.category!!)} rounded-full first-letter:uppercase`}>
                                {selectedProduct?.category}
                            </span>
                        </div>

                        <div className="flex items-center gap-x-1">
                            <AgregarStock product={selectedProduct!!} />
                            <EditarProductoTable product={selectedProduct!!} />
                        </div>

                    </div>
                </div>

                {/* PRODUCTO INFO */}
                <div className="w-full relative border-[1px] grid grid-cols-4 divide-x rounded-lg border-[#707070] pb-9 pt-9 pl-10 pr-5">
                    <div className="w-full col-start-1 col-end-2">
                        <div className="flex items-center text-2xl gap-x-2 font-semibold text-[#3C3C3C]">
                            <StockSvg className="size-6 stroke-[#3C3C3C]" />
                            Stock
                        </div>
                        <div className="flex  items-center text-3xl gap-x-2 font-semibold text-[#3C3C3C]">
                            <span className="text-[#0077FF]">{selectedProduct?.stock}</span>
                            <span className="first-letter:uppercase">unidades</span>
                        </div>
                    </div>
                    <div className="w-full col-start-2 pl-10 col-end-3">
                        <div className="flex items-center text-2xl gap-x-2 font-semibold text-[#3C3C3C]">
                            <VentasSvg className="size-6 fill-[#3C3C3C]" />
                            Ventas de hoy
                        </div>
                        <div className="flex items-center text-3xl gap-x-2 font-semibold text-[#3C3C3C]">
                            <span className="text-[#19AD0F]">${VENTAS_DEL_DIA}</span>
                        </div>
                    </div>
                    <div className="w-full pl-10 col-start-3 col-end-5 flex items-start justify-between">
                        <div className="w-full">
                            <div className="flex items-center text-2xl gap-x-2 font-semibold text-[#3C3C3C]">
                                <Entradas className="fill-[#3C3C3C] size-6" />
                                Salida
                            </div>
                            <div className="flex items-center text-3xl gap-x-2 font-semibold text-[#3C3C3C]">
                                <span className="text-[#DD1313]">${SALIDAS_MES}</span>
                            </div>
                        </div>
                        <div className="w-full flex flex-col h-full items-end justify-start">
                            <span className="border-[1px] absolute right-3 top-4 rounded-sm border-[#3C3C3C] p-3">
                                <Filter className="size-5 fill-[#3C3C3C]" />
                            </span>
                            <div className="flex items-center gap-x-2 mt-8 text-[#3C3C3C] text-2xl font-bold">
                                <span className="text-[#707070]">{date.split(" ")[1]}</span>
                                <span className="text-[#707070]">{date.split(" ")[2]}</span>
                            </div>

                            <div className="flex items-center gap-x-2 text-[#3C3C3C] text-lg font-bold">
                                <span className="text-[#707070]">{date.split(" ")[0]}</span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* NAV OPC */}
                <div className='w-full flex items-center border-b  pt-[40px] border-[#3C3C3C]'>
                    <div className="w-fit" onClick={() => setselectedField(0)}>
                        <NavButton
                            name='Stock'
                            type='no'
                            selected={selectedField === 0}
                        />
                    </div>
                    <div className="w-fit" onClick={() => setselectedField(1)}>
                        <NavButton
                            name='Ventas de hoy'
                            type='no'
                            selected={selectedField === 1}
                        />
                    </div>
                    <div className="w-fit" onClick={() => setselectedField(2)}>
                        <NavButton
                            name='Salida'
                            type='no'
                            selected={selectedField === 2}
                        />
                    </div>
                    <div className="w-fit" onClick={() => setselectedField(3)}>
                        <NavButton
                            name='Analitica'
                            type='no'
                            selected={selectedField === 3}
                        />
                    </div>

                </div>

                {/* FIELDS */}
                <ProductOpc type={['stock', 'ventas', 'salida', 'analitica'][selectedField] as 'stock' | 'ventas' | 'salida' | 'analitica'} product={selectedProduct!!} />
            </div>
        </div>
    )
}



export default Producto
