import { CategoriaSvg, Entradas, StockSvg, VentasSvg } from "@/assets/svg"
import TableCell from "./products.cell"
import FiltroProductsDropdown from "../dropdown/filtro.products.dropdown"
import AgregarProductDialog from "../dialog/agregarProdcut.dialog"
import { useProductosStore } from "@/store/store"
import { useEffect, useState } from "react"
import { Product } from "@/types"
import { ArrowLeft, ArrowRight } from "lucide-react"
import TableLoader from "../loader/table.loader"
import ActualizarInventario from "../dialog/actualizarInventario"


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

interface ProductTableProps {
    loading: boolean
}

export function ProductsTable({ loading }: ProductTableProps) {

    const SelectedFilter = useProductosStore((state) => state.selectedFilter)
    const Products = useProductosStore((state) => state.productos)
    const CargarProducts = useProductosStore((state) => state.cargarProduct)
    const searchProduct = useProductosStore((state) => state.searchInput)

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
        <div className="w-full grid grid-cols-12 text-xl font-semibold text-[#3c3c3c] ">
            {
                TableCategories.map((categorie, index) => (
                    <>
                        {index === 0 && (
                            <div className="col-span-3  lg:col-span-2 xl:col-span-3 flex items-center pl-10">
                                <span className="">{categorie.name}</span>
                            </div>
                        )}
                        {index === 1 && (
                            <div className="col-span-2 flex items-center gap-2 ">
                                <span className="text-[#3c3c3c]">{categorie.svg}</span>
                                <h2 className="text-[#3c3c3c]">{categorie.name}</h2>
                            </div>
                        )}
                        {index === 2 && (
                            <div className="col-span-1 flex items-center justify-center gap-2 ">
                                <span className="text-[#3c3c3c]">{categorie.svg}</span>
                                <h2 className="text-[#3c3c3c]">{categorie.name}</h2>
                            </div>
                        )}
                        {index === 3 && (
                            <div className="col-span-2 flex items-center justify-center gap-2 ">
                                <span className="text-[#3c3c3c]">{categorie.svg}</span>
                                <h2 className="text-[#3c3c3c]">{categorie.name}</h2>
                            </div>
                        )}
                        {index === 4 && (
                            <div className="col-span-1 py-3 flex items-center gap-2 ">
                                <span className="text-[#3c3c3c]">{categorie.svg}</span>
                                <h2 className="text-[#3c3c3c]">{categorie.name}</h2>
                            </div>
                        )}
                        {index === 5 && (
                            <div className="col-span-3 lg:col-span-4 lg:ml-4  xl:ml-0 xl:col-span-3 py-3 grid grid-cols-3 items-center gap-2 ">
                                <div className="col-span-1">
                                    <FiltroProductsDropdown />
                                </div>
                                <div className="col-span-1">
                                    <AgregarProductDialog />
                                </div>
                                <div className="col-span-1">
                                    <ActualizarInventario/>
                                </div>
                            </div>
                        )}
                    </>

                ))
            }

            {
                loading
                    ? (
                        <TableLoader
                            text="Cargando Informacion de Productos"
                        />
                    )
                    : (
                        <div className="my-2 grid grid-cols-12 col-start-1 col-end-13 border-l border-r border-t border-[#707070] overflow-hidden rounded-lg">
                            {/* Mostrar productos de la página actual */}
                            {
                                productosAmostrar.map((product, index) => (
                                    <TableCell key={index} product={product} />
                                ))
                            }
                        </div>
                    )
            }



            {/* Navegación para paginación */}
            <div className="col-span-12 flex items-center justify-center my-4">
                <button
                    className="border-[1px] transition-all cursor-pointer hover:bg-[#707070] group border-[#707070] text-white px-3 py-2 rounded"
                    onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                    disabled={paginaActual === 1}
                >
                    <ArrowLeft className="size-4 text-[#707070] group-hover:text-white" />
                </button>
                <span className="mx-2">Página {paginaActual}</span>
                <button
                    className="border-[1px] transition-all cursor-pointer hover:bg-[#707070] group border-[#707070] text-white px-3 py-2 rounded"
                    onClick={() => setPaginaActual(prev => Math.min(prev + 1, Math.ceil(Productos.length / productosPorPagina)))}
                    disabled={paginaActual === Math.ceil(Productos.length / productosPorPagina)}
                >
                    <ArrowRight className="size-4 text-[#707070] group-hover:text-white" />
                </button>
            </div>
        </div >
    )
}
