import { Calendario } from "@/assets/svg"
import AnaliticasChart from "@/components/charts/analiticas.chart"
import { formatDate, obtenerIconoServicio } from "@/funcs"
import { useCitasStore, usePOVStore, useServiciosStore, useStockStore } from "@/store/store"
import { Servicio } from "@/types"
import { BriefcaseBusiness, ListFilter, SquareKanban, TrendingDown, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

const Analiticas = () => {

  const citas = useCitasStore((state) => state.citas)
  const cargarCitas = useCitasStore((state) => state.cargarCitas)
  const serviciosById = useServiciosStore((state => state.getServicioById))
  const cargarServicios = useServiciosStore((state => state.cargarServicios))
  const cargarStock = useStockStore((state) => state.cargarStock)
  const facturas = usePOVStore((s)=>s.facturas)
  const cargarFacturas = usePOVStore((s)=>s.cargarFacturas)

  const FechaHoy = formatDate(new Date())

  const [Servicios, setServicios] = useState<(Servicio)[]>([])
  const [MasVendido, setMasVendido] = useState<Servicio>()
  const [MenosVendido, setMenosVendido] = useState<Servicio>()
  const [EntradaPorServicios, setEntradaPorServicios] = useState(0)
  const [TotalCitasMes, setTotalCitasMes] = useState(0) // Nuevo estado para el total de citas

  const [AgendadosChart, setAgendadosChart] = useState<{ fecha: string; agendados: number }[]>([]);

  useEffect(() => {
    cargarStock()
    cargarServicios()
    cargarCitas()
    cargarFacturas()
  }, [])


  useEffect(() => {
    const uniqueServiceIds = new Set(citas.flatMap((cita) => cita.servicios));
    const services = Array.from(uniqueServiceIds)
      .map(servicioId => serviciosById(servicioId))
      .filter((servicio): servicio is Servicio => servicio !== null);

    //ESTOS DOS ARREGLAR
    const totalSum = facturas
      .filter((factura)=> factura.tipo === "Servicios")
      .reduce((acc,factura)=> acc + (factura.total || 0),0)
    
    const totalSumMes = facturas
      .filter(factura => factura?.fecha?.split("/")[1] === String(new Date().getMonth() + 1).padStart(2, '0'))
      .reduce((acc, factura) => acc + (factura.total || 0), 0);

    const meses = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const anioActual = FechaHoy.split(" ")[0].split("/")[2];
    // Crear un array de meses
    const datosPorMes = meses.map(mes => {
      const agendados = citas.reduce((acc, cita) => {
        const [_, mesCita, anio] = cita.fecha.split("/"); // Obtener día, mes y año
        if (anio === anioActual && mesCita === mes) { // Filtrar por año actual y mes
          return acc + 1; // Sumar 1 por cada cita agendada
        }
        return acc;
      }, 0);
      return { fecha: `${mes}/${anioActual}`, agendados }; // Retornar el mes con el total de agendados en formato mm/yy
    });
    
    console.log(facturas)

    setAgendadosChart(datosPorMes);

    setTotalCitasMes(totalSumMes)
    setEntradaPorServicios(totalSum);
    setServicios(services);

  }, [citas, serviciosById,facturas])

  useEffect(() => {
    if (Servicios) {
      const serviciosFiltrados = Servicios.filter(Boolean);
      const servicioMasVendido = serviciosFiltrados.reduce<Servicio>((max, servicio) =>
        (servicio?.agendados!! > (max.agendados ?? 0) ? servicio : max), { name: "Sin datos", category: "N/A", agendados: 0, total: 0 }) as Servicio;

      const servicioMenosVendido = serviciosFiltrados.reduce<Servicio>((min, servicio) =>
        (servicio?.agendados!! < (min.agendados ?? Infinity) ? servicio : min), { name: "Sin datos", category: "N/A", agendados: Infinity, total: 0 }) as Servicio;


      setMasVendido(servicioMasVendido);
      setMenosVendido(servicioMenosVendido);
    }
  }, [Servicios])


  return (
    <div className="w-full min-h-[90dvh]">
      <div className="flex items-center lg:px-[30px] xl:px-[70px] pt-[37px] pb-6 justify-between">
        <div className="flex flex-col w-1/2">
          <h2 className="text-4xl font-semibold text-[#3C3C3C]">Analiticas</h2>
        </div>
      </div>
      <div className="lg:px-[30px] xl:px-[70px]">
        <div className="w-full h-full border-[1px] divide-y border-[#3c3c3c] rounded-lg grid grid-cols-12  grid-rows-6">
          <div className=" col-start-1 px-4 py-5 col-end-4 row-start-1 flex flex-col justify-center row-end-4">
            <div className="flex items-center gap-x-3 px-6">
              <Calendario className="size-6 fill-[#3c3c3c]" />
              <h2 className="text-2xl text-[#3c3c3c] font-semibold">Agendados</h2>
            </div>
            <div className="flex items-center gap-x-3 px-6 ">
              <h5 className="text-2xl text-[#3c3c3c] font-semibold">{citas.length}</h5>
              <h2 className="text-2xl text-[#2b1616] font-semibold">Personas</h2>
            </div>
          </div>
          <div className=" col-start-4 col-end-8 px-4 flex flex-col justify-center py-5 row-start-1 row-end-4">
            <div className="flex items-center gap-x-3 px-6">
              <TrendingUp className="size-6 text-[#3c3c3c]" />
              <h2 className="text-2xl text-[#3c3c3c] font-semibold">Servicio mas vendido</h2>
            </div>
            <div className="flex items-center gap-x-3 px-6 mt-2 ">
              <img className="size-8" src={obtenerIconoServicio(MasVendido?.category!!)} alt="icon of service" />
              <h5 className="text-2xl text-[#3c3c3c] font-semibold">
                {MasVendido?.name!!}
              </h5>
            </div>
          </div>
          <div className=" col-start-8 col-end-13 row-start-1 py-3 row-end-4">
            <div className="w-full h-full flex justify-between items-center">
              <div>
                <div className="flex items-center gap-x-3 px-6">
                  <TrendingDown className="size-6 text-[#3c3c3c]" />
                  <h2 className="text-2xl text-[#3c3c3c] font-semibold">Servicio menos vendido</h2>
                </div>
                <div className="flex items-center gap-x-3 px-6 mt-2 ">
                  <img className="size-8" src={obtenerIconoServicio(MenosVendido?.category!!)} alt="icon of service" />
                  <h5 className="text-2xl text-[#3c3c3c] font-semibold">
                    {MenosVendido?.name!!}
                  </h5>
                </div>
              </div>
              <div className="pr-3 flex items-end justify-end flex-col">
                <button className="w-fit h-fit p-2 mb-2 border rounded-md border-[#3c3c3c]">
                  <ListFilter className="size-5 text-[#3c3c3c]" />
                </button>

                <h3 className="text-2xl text-[#3c3c3c] font-bold">{FechaHoy.split(" ")[1]}{FechaHoy.split(" ")[2]}</h3>
                <h3 className="text-lg font-semibold text-[#707070]">{FechaHoy.split(" ")[0]}</h3>
              </div>
            </div>
          </div>

          <div className="col-start-1 col-end-5 pl-4 flex flex-col justify-center row-start-4 row-end-7">
            <div className="flex items-center gap-x-3 px-6">
              <BriefcaseBusiness className="size-6 text-[#3c3c3c]" />
              <h2 className="text-xl text-[#3c3c3c] font-semibold">Entrada por servicios</h2>
            </div>
            <div className="flex items-center gap-x-3 px-6 mt-2 ">
              <h5 className="text-2xl text-[#0FAD8D] font-semibold">
                ${EntradaPorServicios!!}
              </h5>
            </div>
          </div>
          <div className=" col-start-4 col-end-13 flex pl-4 flex-col justify-center row-start-4 row-end-7">
            <div className="flex items-center gap-x-3 px-6">
              <SquareKanban className="size-6 rotate-180 text-[#3c3c3c]" />
              <h2 className="text-xl text-[#3c3c3c] font-semibold">Total generado este mes</h2>
            </div>
            <div className="flex items-center gap-x-3 px-6 mt-2 ">
              <h5 className="text-2xl text-[#0077FF] font-semibold">
                ${TotalCitasMes!!}
              </h5>
            </div>
          </div>
        </div>
      </div>
      {/* CHARTS */}
      <div className="lg:px-[30px] hidden mt-10 xl:px-[70px]">
        <div className="w-full h-full border-[1px] divide-y border-[#3c3c3c] rounded-lg grid grid-cols-12  grid-rows-6">
          <div className=" col-start-1 px-4 py-5 col-end-5 row-start-1 flex flex-col justify-center row-end-4">
            <div className="flex items-center gap-x-3 px-6">
              <Calendario className="size-6 fill-[#3c3c3c]" />
              <h2 className="text-2xl text-[#3c3c3c] font-semibold">Agendados</h2>
            </div>
            <div className="w-full h-full pt-2">
              <AnaliticasChart
                primaryColor="#3c3c3c"
                secondaryColor="#000000"
                data={Object.values(AgendadosChart!! || {})}
                type="area" // o "area" según lo que necesites
                XAxisKey="fecha" // clave para el eje X
                YAxisKey="agendados" // clave para el eje Y
                XDataKey="agendados" // clave de datos para el eje X
                YDataKey="" // clave de datos para el eje Y (puedes dejarlo vacío si no lo necesitas)
              />
            </div>
          </div>
          <div className=" col-start-5 col-end-9 px-4 flex flex-col justify-center py-5 row-start-1 row-end-4">
            <div className="flex items-center gap-x-3 px-6">
              <TrendingUp className="size-6 text-[#3c3c3c]" />
              <h2 className="text-2xl text-[#3c3c3c] font-semibold">Servicio mas vendido</h2>
            </div>
            <div className="w-full h-full p-3">
              {/* <AnaliticasChart
                primaryColor="#3c3c3c"
                secondaryColor="#000000"
                type="area"
              /> */}
            </div>
          </div>
          <div className=" col-start-9 col-end-13 px-4 flex flex-col justify-center py-5 row-start-1 row-end-4">
            <div className="flex items-center gap-x-3 px-6">
              <TrendingDown className="size-6 text-[#3c3c3c]" />
              <h2 className="text-2xl text-[#3c3c3c] font-semibold">Servicio menos vendido</h2>
            </div>
            <div className="w-full h-full p-3">
              {/* <AnaliticasChart
                primaryColor="#3c3c3c"
                secondaryColor="#000000"
                type="area"
              /> */}
            </div>
          </div>

          <div className="col-start-1 col-end-5 pl-4 flex flex-col justify-center row-start-4 row-end-7">
            <div className="flex items-center gap-x-3 px-6">
              <BriefcaseBusiness className="size-6 text-[#3c3c3c]" />
              <h2 className="text-xl text-[#3c3c3c] font-semibold">Entrada por servicios</h2>
            </div>
            <div className="flex items-center gap-x-3 px-6 mt-2 ">
              <h5 className="text-2xl text-[#0FAD8D] font-semibold">
                ${EntradaPorServicios!!}
              </h5>
            </div>
          </div>
          <div className=" col-start-4 col-end-13 flex pl-4 flex-col justify-center row-start-4 row-end-7">
            <div className="flex items-center gap-x-3 px-6">
              <SquareKanban className="size-6 rotate-180 text-[#3c3c3c]" />
              <h2 className="text-xl text-[#3c3c3c] font-semibold">Total generado este mes</h2>
            </div>
            <div className="flex items-center gap-x-3 px-6 mt-2 ">
              <h5 className="text-2xl text-[#0077FF] font-semibold">
                ${TotalCitasMes!!}
              </h5>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Analiticas
