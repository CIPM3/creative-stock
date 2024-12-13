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
    const searchProduct = useStore((state) => state.searchInput)

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
        if (searchProduct !== null && searchProduct.trim() !== "") {
            const searchNormalized = searchProduct.toLocaleLowerCase();

            productosFiltrados = productosFiltrados.filter(producto => {
                const nombreProductoNormalized = producto.name.toLocaleLowerCase();
                return nombreProductoNormalized.includes(searchNormalized);
            });
        }

        // BUSQUEDA POR CATEGORIA
        if (categoria !== null && categoria.trim() !== "") {
            const categoriaNormalized = categoria.toLocaleLowerCase();
            const categoriasValidas = ["cabello", "uñas", "maquillaje", "otros"];

            if (categoriasValidas.includes(categoriaNormalized)) {
                productosFiltrados = productosFiltrados.filter(producto =>
                    producto.category.toLocaleLowerCase() === categoriaNormalized
                );
            }
        }

        // BUSQUEDA POR STOCK //TODO
        if (categoria !== null && categoria.trim() !== "") {
            const categoriaNormalized = categoria.toLocaleLowerCase();
            const categoriasValidas = ["stock bajo", "stock alto"];

            if (categoriasValidas.includes(categoriaNormalized)) {
                if (categoriaNormalized === "stock bajo") {
                    productosFiltrados = [...productosFiltrados].sort((a, b) => a.stock - b.stock);
                } else if (categoriaNormalized === "stock alto") {
                    productosFiltrados = [...productosFiltrados].sort((a, b) => b.stock - a.stock);
                }

            }
        }

        // BUSQUEDA POR VENTA //TODO
        if (categoria !== null && categoria.trim() !== "") {
            const categoriaNormalized = categoria.toLocaleLowerCase();
            const categoriasValidas = ["mayor venta", "menor venta"];

            if (categoriasValidas.includes(categoriaNormalized)) {
                if (categoriaNormalized === "mayor venta") {
                    productosFiltrados = [...productosFiltrados].sort((a, b) => b.sells - a.sells)
                }
                if (categoriaNormalized === "menor venta") {
                    productosFiltrados = [...productosFiltrados].sort((a, b) => a.sells - b.sells)
                }
            }

        }

        // BUSQUEDA POR ENTRADA //TODO
        if (categoria !== null && categoria.trim() !== "") {
            const categoriaNormalized = categoria.toLocaleLowerCase();
            const categoriasValidas = ["entrada alta", "entrada baja"];

            if (categoriasValidas.includes(categoriaNormalized)) {
                if (categoriaNormalized === categoriasValidas[0]) {
                    productosFiltrados = [...productosFiltrados].sort((a, b) => b.incomes - a.incomes)
                }
                if (categoriaNormalized === categoriasValidas[1]) {
                    productosFiltrados = [...productosFiltrados].sort((a, b) => a.incomes - b.incomes)
                }
            }
        }

        // Si después de filtrar, no hay productos, retornar todos los productos
        if (productosFiltrados.length === 0) {
            productosFiltrados = Products;
        }

        return productosFiltrados;
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
