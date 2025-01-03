import SearchInput from "@/components/inputs/search.input"
import ServiciosTable from "@/components/table/servicios.table"
import { useServiciosStore } from "@/store/store"
import { Servicio } from "@/types"
import { useEffect, useState } from "react"

const Servicios = () => {
  const serviciosData = useServiciosStore((state) => state.servicio)

  const [SearchServicios, setSearchServicios] = useState("")
  const [DataFiltrada, setDataFiltrada] = useState(serviciosData)
  const [loading, setLoading] = useState(true);

  const cargarServicios = useServiciosStore((state) => state.cargarServicios)
  const filtro = useServiciosStore((state) => state.selectedFilter)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await cargarServicios();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    HandleData()
  }, [SearchServicios, filtro]);

  const HandleData = () => {
    let filteredDataService: Servicio[] = serviciosData;

    if (SearchServicios.length > 0) {
      filteredDataService = filteredDataService.filter((servicio) =>
        servicio.name.includes(SearchServicios)
      );
    }

    if (filtro) {
      switch (filtro) {
        case 'Uñas':
          filteredDataService = filteredDataService.filter(
            (servicio) => servicio.category === 'unas'
          );
          break;
        case 'Cabello':
          filteredDataService = filteredDataService.filter(
            (servicio) => servicio.category === 'corte'
          );
          break;
        case 'Maquillaje':
          filteredDataService = filteredDataService.filter(
            (servicio) => servicio.category === 'labial'
          );
          break;
        case 'Masaje':
          filteredDataService = filteredDataService.filter(
            (servicio) => servicio.category === 'masaje'
          );
          break;
        case 'Más agendados':
          filteredDataService = [...filteredDataService].sort((a, b) => b.agendados - a.agendados);
          break;
        case 'menos agendados':
          filteredDataService = [...filteredDataService].sort((a, b) => a.agendados - b.agendados);
          break;
      }
    }

    setDataFiltrada(filteredDataService);
  }


  return (
    <div className="w-full min-h-[90dvh]">
      <div className="flex items-center lg:px-[30px] xl:px-[70px] pt-[37px] pb-6 justify-between">
        <div className="flex flex-col w-1/2 ">
          <h2 className="text-4xl font-semibold text-[#3C3C3C]">Servicios</h2>
        </div>
        <div className="flex flex-col w-1/2 overflow-hidden relative items-end">
          <SearchInput onChange={(e) => {
            setSearchServicios(e.target.value)
          }} />
        </div>
      </div>
      <div className="flex flex-col justify-center lg:px-[30px] xl:px-[70px] ">
        <ServiciosTable data={DataFiltrada} loading={loading}/>
      </div>
    </div>
  )
}

export default Servicios
