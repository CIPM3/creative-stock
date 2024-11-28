import { useRef, useState } from "react"
import { Arrow, Filter } from "../assets/svg"
import DayButton from "../components/buttons/day.button"
import { obtenerDiasDeLaSemana } from "../funcs"
import AgendarButton from "../components/buttons/agendar.button"
import { FakeData } from "../data"
import AgendaCard from "@/components/cards/agenda.card"
import AgendarDialog from "@/components/dialog/agendar.dialog"
import { Input } from "@/components/ui/input"


const Agenda = () => {

  const citas = FakeData

  const [timeline, settimeline] = useState("semana")
  const dialogRef = useRef<HTMLButtonElement>(null)

  const Days = timeline === "semana" ? obtenerDiasDeLaSemana() : obtenerDiasDeLaSemana()

  // Función para filtrar y ordenar citas
  const filtrarYOrdenarCitas = (fechaFiltro: string) => {
    const citasFiltradasPorDia = citas.filter(cita =>
      cita.fecha.split('/')[0] === fechaFiltro
    );

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
        <div className="flex flex-col ">
          <h2 className="text-4xl font-semibold text-[#3C3C3C]">Agenda</h2>
          <div className="flex items-center gap-4 pt-3">
            <button onClick={() => { settimeline("semana") }} className={`w-32 transition-all h-14 rounded-xl font-light border ${timeline === "semana" ? "bg-[#d7e5f3] border-[#336EB1] text-[#336EB1]" : "border-[#707070] text-[#707070] bg-[#eaeaea]"}`}>Semana</button>
            <button onClick={() => { settimeline("mes") }} className={`w-32 transition-all h-14 rounded-xl font-light border ${timeline === "mes" ? "bg-[#d7e5f3] border-[#336EB1] text-[#336EB1]" : "border-[#707070] text-[#707070] bg-[#eaeaea]"}`}>Mes</button>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <Input />
          <button className="flex w-36 h-14 items-center font-semibold text-xl border border-[#3C3C3C] rounded-lg mt-3 justify-center gap-2">
            <Filter className="size-6 fill-[#3C3C3C]" />
            Filtrar
            <Arrow className="size-2 fill-[#3C3C3C]" />
          </button>
        </div>
      </div>

      {/* SEMANA SECTION */}
      <div className="w-full h-full px-[70px] pt-6 pb-6 bg-[#EAEAEA]">
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
            <div key={index} className="flex flex-col gap-3 pt-4">
              {filtrarYOrdenarCitas(day.split(" ")[1]).map((cita, citaIndex) => (
                <AgendaCard key={citaIndex} cita={cita} />
              ))}
            </div>
          ))}
        </div>

        {/* DIALOG DE AGENDAR */}
        <AgendarDialog dialogRef={dialogRef} />

      </div>
    </div>
  )
}

export default Agenda
