import { Calendario, Edit, Entradas, Opc } from "@/assets/svg"
import { formatDate, generateWeeksForMonth, obtenerIconoServicio } from "@/funcs"
import { useCitasStore, useServiciosStore } from "@/store/store"
import { Cita, Servicio as Service } from "@/types"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import NavButton from '@/components/ui/navButton';
import ServiceChart from "@/components/charts/service.chart"

const Servicio = () => {

    const { id } = useParams()
    const date = new Date()
    const parsedDate = formatDate(date).split(" ")
    const [selectedService, setselectedService] = useState<Service | null>()
    const [citasOfService, setcitasOfService] = useState<Cita[]>()
    const [citasAgendadas, setcitasAgendadas] = useState<{ fecha: string; agendados: number; citas: Cita[] }[]>([])
    const [selectedSection, setselectedSection] = useState<'agendados' | 'analitica'>('analitica')

    const getServicio = useServiciosStore((state) => state.getServicioById)
    const citas = useCitasStore((state) => state.citas)

    const handleServiceToday = () => {

        const citasFiltered = citas.filter(cita => cita.fecha === parsedDate[0] && cita.servicios.includes(id!!))

        setcitasOfService(citasFiltered)
    }

    const handleServices = () => {
        const citasFiltered = citas.filter(cita => cita.servicios.includes(id!!))

        // Agrupar citas por fecha
        const citasAgrupadas = citasFiltered.reduce((acc, cita) => {
            const fecha = cita.fecha;
            if (!acc[fecha]) {
                acc[fecha] = { fecha, agendados: 0, citas: [] };
            }
            acc[fecha].agendados += 1; // Aumentar el contador de agendados
            acc[fecha].citas.push(cita);
            return acc;
        }, {} as Record<string, { fecha: string; agendados: number; citas: Cita[] }>);

        // Convertir el objeto a un array y ordenar por fecha (más reciente primero)
        const citasOrdenadas = Object.values(citasAgrupadas).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        setcitasAgendadas(citasOrdenadas)
    }

    useEffect(() => {
        setselectedService(getServicio(id!!))
        handleServiceToday()
        handleServices()
    }, [])

    return (
        <div className="w-full min-h-[90dvh]">
            <div className="flex flex-col items-center lg:px-[30px] xl:px-[70px] pt-[37px] pb-6 justify-between">
                {/* INFO SECTION */}
                <div className="flex flex-col w-full ">
                    <div className="w-1/2">
                        <h2 className="text-4xl font-semibold text-[#3C3C3C]">Servicios</h2>

                    </div>
                    <div className="w-full mt-3 text-xl space-x-2 font-light flex justify-between items-center">
                        <div className="flex items-center gap-x-2">
                            <span>Servicios</span>
                            <span>{'>'}</span>
                            <span className="text-[#0077FF]">{selectedService?.name}</span>
                        </div>

                        <div className="flex items-center gap-x-6">
                            <span className="flex items-center text-lg gap-x-2">Categoria: <img className="size-5 " src={obtenerIconoServicio(selectedService?.category!!)} alt={selectedService?.category} /></span>

                            <button className="p-2 rounded-md border-[1px] border-[#3C3C3C]"><Edit className="size-5 stroke-[#3C3C3C]" /></button>
                        </div>

                    </div>
                </div>

                {/* INFO ANALYCS */}
                <div className="border-[1px] border-[#3C3C3C] divide-x p-4 grid grid-cols-8 w-full mt-5 rounded-lg">
                    <div className="col-start-1 col-end-3 p-4 ">
                        <div className="flex font-bold text-2xl gap-x-3 text-[#3C3C3C] items-center">
                            <Calendario className="size-6 fill-[#3C3C3C]" />
                            Agendados de hoy
                        </div>

                        <div className="flex items-center font-bold mt-3 gap-x-3 text-3xl">
                            <span className="text-[#0077FF]">{citasOfService?.length}</span>

                            <span className=" text-[#3C3C3C]">agendados</span>

                        </div>

                    </div>
                    <div className="col-start-3 col-end-5 px-8 py-4">
                        <div className="flex font-bold text-2xl gap-x-3 text-[#3C3C3C] items-center">
                            <Entradas className="size-6 fill-[#3C3C3C]" />
                            Entrada
                        </div>
                        <div className="flex items-center font-bold text-3xl mt-3 text-[#19AD0F]">
                            ${selectedService?.total!! * citasOfService?.length!!}
                        </div>
                    </div>
                    <div className="w-full col-start-5 col-end-9 h-full flex flex-col items-end justify-center">
                        <button className="p-3 border-[1px] border-[#3C3C3C] rounded-sm"><Opc className="size-5 fill-[#3C3C3C]" /></button>
                        <span className="font-bold text-2xl text-[#3C3C3C] mt-2 ">{parsedDate[1]} {parsedDate[2]}</span>
                        <span className="font-bold text-xl text-[#707070]">{parsedDate[0]}</span>
                    </div>
                </div>

                {/* INFO OPC */}
                <div className="w-full flex border-b-[1px] border-[#3C3C3C] mt-5">
                    <div onClick={() => setselectedSection("agendados")}>
                        <NavButton
                            name='Agendados'
                            type='no'
                            selected={selectedSection === 'agendados'}
                        />
                    </div>
                    <div onClick={() => setselectedSection("analitica")}>
                        <NavButton
                            name='Analítica'
                            type='no'
                            selected={selectedSection === 'analitica'}
                        />
                    </div>

                </div>

                {/* OPC FIELD */}
                {selectedSection === "agendados" && (
                    <ServicioAgendado citasAgendadas={citasAgendadas} selectedService={selectedService!!} />
                )}

                {
                    selectedSection === "analitica" && (
                        <ServicioAnalitica selectedService={selectedService!!} />
                    )
                }
            </div>
        </div>
    )
}

interface agendadosProps {
    citasAgendadas: { fecha: string; agendados: number; citas: Cita[] }[],
    selectedService: Service | null
}

const ServicioAgendado = ({ citasAgendadas, selectedService }: agendadosProps) => {
    return (
        <div className="flex flex-col w-full h-fit mt-5">
            <div className="grid w-full grid-cols-12 my-6">
                <div className="col-start-1  col-end-4 "></div>
                <div className="col-start-4  col-end-6 "></div>
                <div className="col-start-6  col-end-7 flex justify-center text-[#3C3C3C] text-xl font-bold ">Agendado</div>
                <div className="col-start-7  col-end-8 flex justify-center text-[#3C3C3C] text-xl font-bold">Entrada</div>
                <div className="col-start-8  col-end-11 "></div>
                <div className="col-start-11  col-end-13 "></div>
            </div>

            <div className="w-full grid grid-cols-12 border-[1px] border-[#3C3C3C] rounded-lg">
                {/* CELL */}
                {
                    citasAgendadas?.map((servicio) => (
                        <div className="py-5 w-full last-of-type:border-b-0 border-b-[1px] border-[#3C3C3C] col-start-1 grid col-end-13 grid-cols-12">
                            <div className="col-start-1 font-bold text-xl text-[#3C3C3C] col-end-4 flex pl-20">
                                {selectedService?.name}
                            </div>

                            <div className="col-start-4 flex justify-center items-center col-end-6">
                                <img className="size-7" src={`${obtenerIconoServicio(selectedService?.category!!)}`} alt={selectedService?.category} />
                            </div>

                            <div className="col-start-6  text-[#0077FF] flex  text-xl items-center justify-center font-bold col-end-7">
                                +{servicio.citas.length}
                            </div>
                            <div className="col-start-7 text-[#19AD0F] flex  text-xl items-center justify-center font-bold col-end-8">
                                ${servicio.citas.length * selectedService?.total!!}
                            </div>

                            <div className="col-start-9 col-end-11 text-xl flex justify-end  font-bold text-[#707070] ">
                                {servicio.fecha}
                            </div>

                            <div className="col-start-11 col-end-13 flex justify-center font-bold text-[#707070] text-xl">
                                {servicio.citas[0].hora}
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

interface analiticaProps {
    selectedService: Service | null
}

const ServicioAnalitica = ({selectedService}:analiticaProps) => {
    const { id } = useParams()
    const [timeline, settimeline] = useState<'semanal' | 'mes'>('semanal');
    const [timelineData, settimelineData] = useState<{ fecha: string; citas: number }[]>([]);
    const citas = useCitasStore((state) => state.citas)
    const cargarCitas = useCitasStore((state) => state.cargarCitas)


    const handleTimeline = () => {
        if (timeline === "semanal") {
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Ajustar al inicio de la semana (domingo)

            const weekDays = Array.from({ length: 7 }, (_, i) => {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + i);
                return formatDate(date).split(" ")[0]; // Formato de fecha deseado
            });

            const citasAgrupadas = weekDays.map(day => {
                return {
                    fecha: day,
                    citas: citas?.filter(cita => cita.fecha === day && cita.servicios.includes(id!!)).length
                };
            });

            settimelineData(citasAgrupadas)
        }

        if (timeline === "mes") {
            const currentDate = new Date();
            const month = currentDate.getMonth() + 1; // Obtener el mes actual (1-12)
            const year = currentDate.getFullYear();

            const weeks = generateWeeksForMonth(month, year);

            console.log(weeks)
            const citasAgrupadas = weeks.map(week => {
                return {
                    fecha: week.fecha,
                    citas: week.dias.reduce((acc, dia) => {
                        return acc + citas.filter(cita => cita.fecha === dia && cita.servicios.includes(id!!)).length;
                    }, 0)
                };
            });

            settimelineData(citasAgrupadas);
        }
    }

    useEffect(() => {
        cargarCitas()
    }, [])

    useEffect(() => {
        handleTimeline()
    }, [citas, timeline])

    console.log(timelineData)

    return (
        <div className="w-full grid grid-cols-2 h-full gap-x-5">
            <div className="grid grid-cols-1">
                <div className="w-full flex items-center py-3 justify-end gap-x-3">
                    <button onClick={() => settimeline("semanal")} className={`w-32 rounded-lg h-14 border-[1px] ${timeline === "semanal" ? "bg-[#D8E5F3] border-[#336EB1] text-[#336EB1]" : "border-[#3c3c3c] bg-[#EAEAEA]"}`} >Semana</button>
                    <button onClick={() => settimeline("mes")} className={`w-32 rounded-lg h-14 border-[1px] ${timeline === "mes" ? "bg-[#D8E5F3] border-[#336EB1] text-[#336EB1]" : "bg-[#EAEAEA] border-[#3c3c3c]"}`} >Mes</button>
                </div>

                <ServiceChart data={timelineData} />
            </div>
            <div className="w-full h-full">
                <div className="w-full flex items-center py-3 justify-end gap-x-3">
                    <button className="w-32 h-14 border-[1px] border-[#3c3c3c] rounded-lg invisible"></button>
                </div>
                <div className="border-[1px] border-[#3c3c3c] rounded-lg w-full h-fit">
                    {
                        timelineData.map(weekOrDay => (
                            <div className="w-full border-b-[1px] border-[#3c3c3c] last-of-type:border-b-0 grid grid-cols-4 items-center py-3 px-6">
                                <span className="text-2xl font-semibold text-[#3c3c3c]">{weekOrDay.fecha}</span>
                                <span className="text-2xl font-semibold text-[#19AD0F]">${weekOrDay.citas * selectedService?.total!!}</span>
                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
    )
}

export default Servicio
