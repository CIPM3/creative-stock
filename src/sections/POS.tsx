import { All } from "@/assets/svg"
import SearchInput from "@/components/inputs/search.input"
import { Banknote, CreditCard, EllipsisVertical, Plus, Trash } from "lucide-react"
import NavButton from '@/components/ui/navButton';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Filter_POV_Data, getCatColors, obtenerIconoServicio } from "@/funcs";
import PovProductCard from "@/components/cards/pov.product.card";
import { useProductosStore, useServiciosStore } from "@/store/store";
import PovServicioCard from "@/components/cards/pov.servicio.card";
import { Product, Servicio } from "@/types";
import POVAgendadosDialog from "@/components/dialog/pov.agendados.dialog";


const POV = () => {
  const [FieldSelected, setFieldSelected] = useState<'Productos' | 'Servicios'>('Productos')
  const [ItemFilters, setItemFilters] = useState<'todo' | 'cabello' | 'unas' | 'maquillaje' | 'otros'>('todo')
  const [POV_BUTTONS, setPOV] = useState(false)
  const [InputText, setInputText] = useState("")
  const [ServiciosFiltrados, setServiciosFiltrados] = useState<Servicio[]>()
  const [ProductosFiltrados, setProductosFiltrados] = useState<Product[]>()

  const productos = useProductosStore((state) => state.productos)
  const cargarProduct = useProductosStore((state) => state.cargarProduct)

  const serviciosData = useServiciosStore((state) => state.servicio)
  const cargarServicios = useServiciosStore((state) => state.cargarServicios)

  useEffect(() => {
    cargarProduct()
    cargarServicios()
  }, [])

  useEffect(() => {
    // Función genérica para filtrar datos
    if (FieldSelected === 'Productos') {
      const filtered = Filter_POV_Data<Product>(
        productos,
        FieldSelected,
        ItemFilters,
        InputText
      );
      setProductosFiltrados(filtered);
    } else if (FieldSelected === 'Servicios') {
      const filtered = Filter_POV_Data<Servicio>(
        serviciosData,
        FieldSelected,
        ItemFilters,
        InputText
      );
      setServiciosFiltrados(filtered);
    }

  }, [InputText, ItemFilters, FieldSelected, productos, serviciosData])



  return (
    <div className="w-full min-h-svh ">
      <div className="lg:pl-[30px] xl:pl-[70px] min-h-screen grid grid-cols-12 w-full h-full ">
        <div className="col-start-1 grid grid-cols-12 grid-rows-12 col-end-9 pt-9 ">
          <div className="col-start-1 col-end-13 grid grid-cols-12 items-center ">
            <h2 className="text-4xl font-semibold text-[#3C3C3C] col-start-1 col-end-5">Punto de venta</h2>

            <div className="col-start-8 col-end-13">
              <SearchInput onChange={(e) => setInputText(e.target.value)} />
            </div>
          </div>

          <div className="col-start-1 col-end-13 grid grid-cols-12 border-b-[1px] mr-9 border-[#3c3c3c] items-center ">
            <div className="col-start-1 col-end-5 w-full h-full flex items-end">
              <div onClick={() => setFieldSelected("Productos")}>
                <NavButton
                  name="Productos"
                  type="no"
                  selected={FieldSelected === "Productos"}
                />
              </div>
              <div onClick={() => setFieldSelected("Servicios")}>
                <NavButton
                  name="Servicios"
                  type="no"
                  selected={FieldSelected === "Servicios"}
                />
              </div>
            </div>
            <div className="col-start-6 col-end-13 gap-x-1 flex items-center justify-end w-full h-full">
              <span onClick={() => setItemFilters("todo")} className={`${getCatColors("todo")} first-letter:uppercase cursor-pointer font-bold border-[1px] flex w-fit rounded-lg gap-x-2 items-center px-3 py-2`}>
                <All className="size-4 stroke-[#336EB1] " />
                Todo
              </span>
              <span onClick={() => setItemFilters("cabello")} className={`${getCatColors("cabello")} first-letter:uppercase cursor-pointer font-bold border-[1px] flex w-fit rounded-lg gap-x-2 items-center px-3 py-2`}>
                <img className="size-4" src={obtenerIconoServicio("corte")} alt="cabello" />
                Cabello
              </span>
              <span onClick={() => setItemFilters("unas")} className={`${getCatColors("uñas")} first-letter:uppercase cursor-pointer font-bold border-[1px] flex w-fit rounded-lg gap-x-2 items-center px-3 py-2`}>
                <img className="size-4" src={obtenerIconoServicio("unas")} alt="unas" />
                Uñas
              </span>
              <span onClick={() => setItemFilters("maquillaje")} className={`${getCatColors("maquillaje")} first-letter:uppercase cursor-pointer font-bold border-[1px] flex w-fit rounded-lg gap-x-2 items-center px-3 py-2`}>
                <img className="size-4" src={obtenerIconoServicio("labial")} alt="maquillaje" />
                Maquillaje
              </span>
              <span onClick={() => setItemFilters("otros")} className={`${getCatColors("masaje")} first-letter:uppercase cursor-pointer font-bold border-[1px] flex w-fit rounded-lg gap-x-2 items-center px-3 py-2`}>
                <img className="size-4" src={obtenerIconoServicio("masaje")} alt="masaje" />
                Otros
              </span>
            </div>
          </div>

          <div className="col-start-1 grid grid-cols-12 overflow-x-hidden gap-3 mr-9 grid-rows-3 pt-9 col-end-13 row-start-3 row-end-13 overflow-y-auto">
            {
              FieldSelected === "Productos" && ProductosFiltrados && (
                <>
                  {
                    ProductosFiltrados.map((producto, index) => (
                      <PovProductCard key={index} product={producto} />
                    ))
                  }
                </>
              )
            }

            {
              FieldSelected === 'Servicios' && ServiciosFiltrados && (
                <>
                  {
                    ServiciosFiltrados.map((servicio, index) => (
                      <PovServicioCard key={index} service={servicio} />
                    ))
                  }
                </>
              )
            }

          </div>
        </div>
        <div className="col-start-9 col-end-13 gap-4 bg-[#EAEAEA] p-9 grid grid-cols-1 grid-rows-2">
          {
            !POV_BUTTONS && <POVBUTTONS setPOV={setPOV} />
          }

          {
            POV_BUTTONS && (
              <div className="w-full h-full grid grid-cols-12 grid-rows-12 col-span-1 row-span-2 ">
                <div className="flex items-center col-span-12 row-span-1 justify-between">
                  <h3 className="text-4xl font-semibold text-[#3c3c3c]">Caja</h3>

                  <button className="border-[1px] size-12 flex justify-center items-center rounded-lg border-[#3c3c3c]">
                    <EllipsisVertical className="text-[#3c3c3c] size-6" />
                  </button>
                </div>
                <div className="col-span-12 row-span-1 flex items-center">
                  <h3 className="text-2xl text-[#3c3c3c] font-semibold">Orden actual {FieldSelected === "Servicios" && "por agendado"}</h3>
                </div>
                {
                  FieldSelected === "Servicios" && (
                    <div className="col-span-12 row-span-1 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-[#3c3c3c]">Nombre Apellido</h3>

                      <div className="grid grid-flow-col gap-x-2">
                        <div className="size-7 border-[1px] border-[#707070] rounded-md"></div>
                        <div className="size-7 border-[1px] border-[#707070] rounded-md"></div>
                      </div>
                    </div>
                  )
                }
                <div className="col-span-12 row-span-5 overflow-y-auto overflow-x-hidden grid grid-cols-12 items-start">
                  <POVCARDITEM />
                  <POVCARDITEM />
                  <POVCARDITEM />

                </div>
                <POVCHECKOUT setPOV={setPOV} />
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

interface POV_BUTTONS_PROPS {
  setPOV: Dispatch<SetStateAction<boolean>>;
}

const POVBUTTONS = ({ setPOV }: POV_BUTTONS_PROPS) => {
  return (
    <>
      <button
        onClick={() => setPOV(true)}
        className="col-start-1 col-end-2 row-start-1 row-end-2 w-full h-full  rounded-lg
          border-[1px] border-[#3c3c3c]  flex flex-col gap-4 justify-center bg-white items-center
          ">
        <Plus className="size-20 text-[#3c3c3c]" />
        <span className="text-2xl font-bold text-[#3c3c3c]">Crear <br /> nueva orden</span>
      </button>
      <POVAgendadosDialog setPOV={setPOV}/>
    </>
  )
}

const POVCARDITEM = () => {
  const [Counter, setCounter] = useState<number>(1)

  return (
    <div className="col-span-12 gap-2 row-span-1 grid grid-cols-12 grid-rows-2">
      <div className="flex items-center justify-between col-span-12 row-span-1">
        <h3 className="text-xl font-semibold text-[#3c3c3c]">Mascarilla facial</h3>

        <span className="text-2xl text-[#3c3c3cc] font-semibold">$35</span>
      </div>
      <div className="col-span-12 flex items-center justify-between">
        <div className="grid grid-cols-3 border-[1px] border-[#3c3c3c] rounded-md">
          <button onClick={() => setCounter((prev) => (prev > 1 ? prev - 1 : prev))} className="size-7 col-span-1">-</button>
          <span className="col-span-1 flex items-center justify-center border-x-[1px] border-[#3c3c3c]">{Counter}</span>
          <button onClick={() => setCounter((prev) => prev + 1)} className="size-7 col-span-1">+</button>
        </div>
        <Trash className="text-[#3c3c3c] size-5" />
      </div>
    </div>
  )
}

interface POV_CHECKOUT {
  setPOV: Dispatch<SetStateAction<boolean>>; // Agregar esta línea
}

const POVCHECKOUT = ({ setPOV }: POV_CHECKOUT) => {
  return (
    <div className="col-span-12 grid items-start pt-3 px-3 grid-cols-12 row-span-3 row-start-9 row-end-13  rounded-md border-[1px] border-[#707070]">
      <div className="col-span-12 row-span-1 flex items-center justify-between ">
        <h5 className="text-xl text-[#707070]">Total</h5>
        <span className="text-xl text-[#707070] font-bold">$55</span>
      </div>
      <div className="col-span-12 border-b-[1px] border-dotted pb-2 border-[#707070] row-span-1 flex items-center justify-between ">
        <h5 className="text-xl text-[#707070]">Impuestos 5%</h5>
        <span className="text-xl text-[#707070] font-bold">$10</span>
      </div>
      <div className="col-span-12 row-span-1 flex items-center justify-between ">
        <h5 className="text-xl text-[#3C3C3C] font-bold">Suma Total</h5>
        <span className="text-xl text-[#3C3C3C] font-bold">$60</span>
      </div>
      <div className="col-span-12 grid gap-x-2 grid-cols-12 row-span-1 items-center ">
        <button className="col-span-6 flex items-center gap-x-2 border-[1px] rounded-md border-[#707070] py-2 px-2"><Banknote /> Efectivo</button>
        <button className="col-span-6 flex items-center gap-x-2 border-[1px] rounded-md border-[#707070] py-2 px-2"><CreditCard /> Debito/Credito</button>
      </div>
      <div className="col-span-12 grid grid-cols-12 row-span-1 items-center">
        <button onClick={() => setPOV(false)} className="col-span-12 rounded-md bg-blue-500 flex items-center justify-center py-2 text-white ">Pargar orden</button>
      </div>
    </div>
  )
}

export default POV
