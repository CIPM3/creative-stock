import { useEffect, useRef, useState } from "react"
import DayButton from "../components/buttons/day.button"
import { obtenerDiasDeLaSemana } from "../funcs"
import AgendarButton from "../components/buttons/agendar.button"
import AgendaCard from "@/components/cards/agenda.card"
import AgendarDialog from "@/components/dialog/agendar.dialog"
import SearchInput from "@/components/inputs/search.input"
import FiltroDropdown from "@/components/dropdown/filtro.dropdown"
import { Cita } from "@/types"
import AgendaItem from "@/components/cards/agenda.card.mes"
import { useStore } from "@/store/store"

const Agenda = () => {

  const cargarCitas = useStore((state) => state.cargarCitas)
  // Cargar citas al montar el componente
  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);
  
  const citas = useStore((state) => state.citas)

  const [SearchClient, setSearchClient] = useState("")

  const [timeline, settimeline] = useState("semana")
  const [selectedFilter, setselectedFilter] = useState("")

  // Función para filtrar y ordenar citas
  const filtrarYOrdenarCitas = (fechaFiltro: string) => {
    // Convertir fechaFiltro a formato "DD/MM/YY"
    const [diaFiltro, mesFiltro, anioFiltro] = fechaFiltro.split('/');

    const citasFiltradasPorDia = citas.filter(cita => {
      const [diaCita, mesCita, anioCita] = cita.fecha.split('/');
      const nombreFiltro = SearchClient; // Cambia esto por el nombre que deseas filtrar
      const servicioFiltro = selectedFilter; // Obtener el servicio seleccionado
      return diaCita === diaFiltro && mesCita === mesFiltro && anioCita === anioFiltro && 
             (!nombreFiltro || cita.nombre.toLowerCase().includes(nombreFiltro.toLocaleLowerCase())) &&
             (!servicioFiltro || cita.servicios.includes(servicioFiltro)); // Filtrar por servicio
    });

    // Ordenar las citas filtradas por hora
    const citasOrdenadas = citasFiltradasPorDia.sort((a, b) => {
      const [horaA, periodoA] = a.hora.split(" ");
      const [horaB, periodoB] = b.hora.split(" ");
      const [horaAInt, minutoA] = horaA.split(":").map(Number);
      const [horaBInt, minutoB] = horaB.split(":").map(Number);

      // Convertir a 24 horas para comparación
      const horaA24 = periodoA === "PM" && horaAInt < 12 ? horaAInt + 12 : horaAInt;
      const horaB24 = periodoB === "PM" && horaBInt < 12 ? horaBInt + 12 : horaBInt;

      // Comparar horas y minutos
      if (horaA24 === horaB24) {
        return minutoA - minutoB;
      }
      return horaA24 - horaB24;
    });

    return citasOrdenadas;
  };

  return (
    <div className="w-full min-h-[90dvh]  ">
      <div className="flex items-center px-[70px] pt-[37px] pb-6 justify-between">
        <div className="flex flex-col w-1/2 ">
          <h2 className="text-4xl font-semibold text-[#3C3C3C]">Agenda</h2>
          <div className="flex items-center gap-4 pt-3">
            <button onClick={() => { settimeline("semana") }} className={`w-32 transition-all h-14 rounded-xl font-light border ${timeline === "semana" ? "bg-[#d7e5f3] border-[#336EB1] text-[#336EB1]" : "border-[#707070] text-[#707070] bg-[#eaeaea]"}`}>Semana</button>
            <button onClick={() => { settimeline("mes") }} className={`w-32 transition-all h-14 rounded-xl font-light border ${timeline === "mes" ? "bg-[#d7e5f3] border-[#336EB1] text-[#336EB1]" : "border-[#707070] text-[#707070] bg-[#eaeaea]"}`}>Mes</button>

          </div>
        </div>

        <div className="flex flex-col w-1/2 overflow-hidden relative items-end">
          <SearchInput onChange={(e) => {
            // Aquí tu lógica de búsqueda
            setSearchClient(e.target.value)
          }} />
          <FiltroDropdown
            setselectedFilter={setselectedFilter}
            selectedFilter={selectedFilter}
            array={[
              'unas',
              'corte',
              'labial',
              'masaje'
            ]} />
        </div>
      </div>

      {/* SEMANA SECTION */}
      {
        timeline === "semana"
          ? (<AgendaSemanal filtrarYOrdenarCitas={filtrarYOrdenarCitas} />)
          : (<AgendaMensual filtrarYOrdenarCitas={filtrarYOrdenarCitas} />)
      }

    </div>
  )
}

interface ASProps {
  timeline?: string,
  filtrarYOrdenarCitas: (fechaFiltro: string ) => Cita[]
}

const AgendaSemanal = ({ filtrarYOrdenarCitas }: ASProps) => {
  const Days = obtenerDiasDeLaSemana()
  const dialogRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="w-full h-full min-h-[70vh] px-[70px] pt-6 pb-6 bg-[#EAEAEA]">
      {/* DIAS */}
      <div className="w-full h-fit grid grid-cols-7 gap-3">
        {
          Days.map((day, index) => (
            <DayButton key={index} day={day} />
          ))
        }
      </div>

      {/* AGENDAR BUTTON */}
      <div className="w-full h-fit grid grid-cols-7 pt-6 gap-3">
        {
          Days.map((index) => (
            <AgendarButton key={index} onClick={() => { dialogRef.current?.click() }} />
          ))
        }
      </div>

      {/* CITAS */}
      <div className="w-full h-fit grid grid-cols-7 gap-3">
        {Days.map((day, index) => (
          <div key={index} className="flex flex-col gap-y-3 pt-4">
            {filtrarYOrdenarCitas(`${day.split(" ")[1]}/${new Date().getMonth() + 1}/${new Date().getFullYear().toString().slice(-2)}`).map((cita, citaIndex) => (
              <AgendaCard dialogRef={dialogRef} key={citaIndex} cita={cita} />
            ))}
          </div>
        ))}
      </div>

      {/* DIALOG DE AGENDAR */}
      <AgendarDialog dialogRef={dialogRef} />

    </div>
  )
}

const AgendaMensual = ({ filtrarYOrdenarCitas }: ASProps) => {
  const diasDelMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); // Obtener el número total de días del mes actual
  const primerDiaDelMes = (new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() + 6) % 7; // Ajustar el día de la semana
  const semanas = []; // Array para almacenar las semanas

  // Crear un array de días, incluyendo espacios vacíos al inicio
  const dias = Array(primerDiaDelMes).fill(null).concat(Array.from({ length: diasDelMes }, (_, i) => {
    const dia = i + 1;
    return dia < 10 ? `0${dia}` : dia.toString(); // Agregar 0 si el día es menor a 10
  }));

  // Agrupar los días en semanas
  for (let i = 0; i < dias.length; i += 7) {
    semanas.push(dias.slice(i, i + 7));
  }

  const dialogRef = useRef<HTMLButtonElement>(null)
  const cancelarRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="w-full h-full px-[70px] pt-6 pb-6 bg-[#EAEAEA]">
      {/* Renderizar el calendario */}
      <div className="w-full h-fit place-content-center gap-3">
        {semanas.map((semana, index) => (
          <div key={index} className="grid grid-cols-7 gap-4 justify-between">
            {semana.map((dia, diaIndex) => (
              <div key={diaIndex} className={`w-full h-fit min-h-44 rounded-lg flex flex-col ${dia && 'border bg-white'} my-3`}>
                {dia !== null && (
                  <AgendaItem cancelarRef={cancelarRef} dialogRef={dialogRef} dia={dia.toString()} diaIndex={diaIndex} filtrarYOrdenarCitas={filtrarYOrdenarCitas} primerDiaDelMes={primerDiaDelMes} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* DIALOG DE AGENDAR */}
      <AgendarDialog dialogRef={dialogRef} />

    </div>
  );
}


export default Agenda
