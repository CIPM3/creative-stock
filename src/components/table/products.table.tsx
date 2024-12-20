import { CategoriaSvg, Entradas, StockSvg, VentasSvg } from "@/assets/svg"
import TableCell from "./products.cell"
import FiltroProductsDropdown from "../dropdown/filtro.products.dropdown"
import AgregarProductDialog from "../dialog/agregarProdcut.dialog"
import { useStore } from "@/store/store"
import { useEffect, useState } from "react"
import { Product } from "@/types"
import { ArrowLeft, ArrowRight } from "lucide-react"


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
        name: 'Ventas de hoy',
        svg: <VentasSvg className="fill-[#3C3C3C]" />
    },
    {
        name: 'Entrada',
        svg: <Entradas className="fill-[#3C3C3C]" />
    },
    {
        name: "opc",
        svg: null
    }
]

export function ProductsTable() {

    const SelectedFilter = useStore((state) => state.selectedFilter)
    const Products = useStore((state) => state.productos)
    const CargarProducts = useStore((state) => state.cargarProduct)
    const searchProduct = useStore((state) => state.searchInput)

    useEffect(() => {
      CargarProducts()
    }, [])
    

    const [Productos, setProductos] = useState<Product[]>([])
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 8;

    // Calcular el índice de inicio y fin de los productos a mostrar
    const indiceInicio = (paginaActual - 1) * productosPorPagina;
    const indiceFin = indiceInicio + productosPorPagina;

    // Mostrar solo los productos de la página actual
    const productosAmostrar = Productos.slice(indiceInicio, indiceFin);

    const filtrarYOrdenarProductos = (categoria: string | null): Product[] => {
        if (!Array.isArray(Products)) {
            console.error("Products no es un arreglo válido.");
            return [];
        }

        let productosFiltrados: Product[] = Products;

        // BUSQUEDA POR NOMBRE
        if (searchProduct?.trim()) {
            const searchNormalized = searchProduct.toLocaleLowerCase();
            productosFiltrados = productosFiltrados.filter(producto => 
                producto.name.toLocaleLowerCase().includes(searchNormalized)
            );
        }

        // BUSQUEDA POR CATEGORIA
        const categoriasValidas: { [key: string]: string } = {
            "cabello": "category",
            "uñas": "category",
            "maquillaje": "category",
            "otros": "category",
            "stock bajo": "stock",
            "stock alto": "stock",
            "mayor venta": "sells",
            "menor venta": "sells",
            "entrada alta": "incomes",
            "entrada baja": "incomes"
        };

        if (categoria?.trim() && categoriasValidas[categoria.toLocaleLowerCase()]) {
            const categoriaNormalized = categoria.toLocaleLowerCase();
            if (["stock bajo", "stock alto"].includes(categoriaNormalized)) {
                productosFiltrados.sort((a, b) => 
                    categoriaNormalized === "stock bajo" ? a.stock - b.stock : b.stock - a.stock
                );
            } else if (["mayor venta", "menor venta"].includes(categoriaNormalized)) {
                productosFiltrados.sort((a, b) => 
                    categoriaNormalized === "mayor venta" ? b.sells - a.sells : a.sells - b.sells
                );
            } else if (["entrada alta", "entrada baja"].includes(categoriaNormalized)) {
                productosFiltrados.sort((a, b) => 
                    categoriaNormalized === "entrada alta" ? b.incomes - a.incomes : a.incomes - b.incomes
                );
            } else {
                productosFiltrados = productosFiltrados.filter(producto =>
                    producto.category.toLocaleLowerCase() === categoriaNormalized
                );
            }
        }

        // Si después de filtrar, no hay productos, retornar todos los productos
        return productosFiltrados.length ? productosFiltrados : Products;
    };

    useEffect(() => {
        setProductos(filtrarYOrdenarProductos(SelectedFilter))
    }, [SelectedFilter, searchProduct, Products])


    return (
        <div className="w-full grid grid-cols-8 gap-2">
            {
                TableCategories.map((categorie, index) => (
                    <div
                        className={`
                    flex items-center gap-x-1 text-xl text-[#707070] font-semibold
                    ${index === 0 && 'col-start-1 col-end-3 pl-20'} 
                    ${index === 5 && 'col-start-7 col-end-9'}
                    `}
                        key={index}>
                        {
                            categorie.name !== 'opc'
                                ? (
                                    <>
                                        {categorie.svg}
                                        {categorie.name}
                                    </>
                                )
                                : (
                                    <div className="grid grid-cols-3  w-full gap-x-1 ">
                                        <FiltroProductsDropdown />

                                        <AgregarProductDialog />
                                    </div>
                                )
                        }

                    </div>
                ))
            }

            <div className="my-2 grid grid-cols-8 col-start-1 col-end-9 border-l border-r border-t border-[#707070] overflow-hidden rounded-lg">
                {/* Mostrar productos de la página actual */}
                {
                    productosAmostrar.map((product, index) => (
                        <TableCell key={index} product={product} />
                    ))
                }

            </div>

            {/* Navegación para paginación */}
            <div className="col-span-8 flex items-center justify-center my-4">
                <button 
                    className="border-[1px] transition-all cursor-pointer hover:bg-[#707070] group border-[#707070] text-white px-3 py-2 rounded" 
                    onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                    disabled={paginaActual === 1}
                >
                    <ArrowLeft className="size-4 text-[#707070] group-hover:text-white"/>
                </button>
                <span className="mx-2">Página {paginaActual}</span>
                <button 
                    className="border-[1px] transition-all cursor-pointer hover:bg-[#707070] group border-[#707070] text-white px-3 py-2 rounded" 
                    onClick={() => setPaginaActual(prev => Math.min(prev + 1, Math.ceil(Productos.length / productosPorPagina)))}
                    disabled={paginaActual === Math.ceil(Productos.length / productosPorPagina)}
                >
                    <ArrowRight className="size-4 text-[#707070] group-hover:text-white"/>
                </button>
            </div>
        </div>
    )
}
