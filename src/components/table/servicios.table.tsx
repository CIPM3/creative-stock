import { Calendario, CategoriaSvg, Entradas } from "@/assets/svg"
import FiltroServiciosDropdown from "../dropdown/filtro.servicios.dropdown"
import ServiciosCell from "./servicio.cell"
import { Servicio } from "@/types"
import AgregarServicio from "../dialog/agregarServicio.dialog"

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
    data: Servicio[]
}

const ServiciosTable = ({data}:Props) => {

    const Servicios = data
    

    return (
        <div className="w-full grid grid-cols-8 gap-2">
            {
                TableCategories.map((categorie, index) => (
                    <div
                        className={`
                    flex items-center gap-x-1 text-xl text-[#707070] font-semibold
                    ${index === 0 && 'col-start-1 col-end-3 pl-20'} 
                    ${index === 4 && 'col-start-7 col-end-9'}
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
                                    <div className="grid grid-cols-3 w-full gap-x-1 ">
                                        <FiltroServiciosDropdown />
                                        <AgregarServicio/>
                                    </div>
                                )
                        }

                    </div>
                ))
            }

            <div className="my-2 grid grid-cols-8 col-start-1 col-end-9 border-l border-r border-t border-[#707070] overflow-hidden rounded-lg">
                {/* Mostrar productos de la página actual */}
                {
                    Servicios.map((product, index) => (
                        <ServiciosCell key={index} servicio={product} />
                    ))
                }

            </div>
        </div>
    )
}

export default ServiciosTable
