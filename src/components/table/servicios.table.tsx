import { Calendario, CategoriaSvg, Entradas } from "@/assets/svg"
import FiltroServiciosDropdown from "../dropdown/filtro.servicios.dropdown"
import ServiciosCell from "./servicio.cell"
import { Servicio } from "@/types"
import AgregarServicio from "../dialog/agregarServicio.dialog"
import TableLoader from "../loader/table.loader"

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
        name: 'Agendados',
        svg: <Calendario className="fill-[#3C3C3C] size-5" />
    },
    {
        name: 'Precio',
        svg: <Entradas className="fill-[#3C3C3C]" />
    },
    {
        name: "opc",
        svg: null
    }
]

interface Props {
    data: Servicio[],
    loading: boolean
}

const ServiciosTable = ({ data, loading }: Props) => {

    const Servicios = data


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
                            <div className="col-span-2 flex items-center justify-center gap-2 ">
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
                            <div className="col-span-3 lg:col-span-4 lg:ml-4  xl:ml-0 xl:col-span-3 py-3 grid grid-cols-3 items-center gap-2 ">
                                <div className="col-span-1">
                                    <FiltroServiciosDropdown />
                                </div>
                                <div className="col-span-2">
                                <AgregarServicio />

                                </div>

                            </div>
                        )}
                    </>

                ))
            }

            {
                loading
                    ? (
                        <TableLoader text="Cargando Informacion de Servicios" />
                    )
                    : (
                        <div className="my-2 grid grid-cols-12 col-start-1 col-end-13 border-l border-r border-t border-[#707070] overflow-hidden rounded-lg">
                            {/* Mostrar productos de la página actual */}
                            {
                                Servicios?.map((product, index) => (
                                    <ServiciosCell key={index} servicio={product} />
                                ))
                            }

                        </div>
                    )
            }

        </div>
    )
}

export default ServiciosTable
