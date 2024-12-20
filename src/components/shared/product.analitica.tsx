import { useState } from "react";
import ProductChart from "../charts/product.chart"


const filterChartData = (data: { fecha: string; entrada: number; salida: number; }[], timeline: 'semana' | 'mes') => {
    const currentDate = new Date();

    // Ordenar los datos por fecha antes de filtrar
    data.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()); // Ordenar por fecha

    if (timeline === "semana") {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Inicio de la semana
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Fin de la semana
        return data.filter(item => {
            if (!item.fecha) return false; // Verificar si fecha está definida

            const itemDateParts = item.fecha.split(" "); // Separar fecha y hora
            const dateParts = itemDateParts[0].split("/"); // Separar día, mes y año
            const timeParts = itemDateParts[1].split(":"); // Separar hora y minutos
            const isPM = itemDateParts[2] === "PM"; // Verificar si es PM

            // Convertir a objeto Date
            const itemDate = new Date(
                parseInt(dateParts[2]) + 2000, // Año
                parseInt(dateParts[1]) - 1, // Mes (0-11)
                parseInt(dateParts[0]), // Día
                isPM ? parseInt(timeParts[0]) + 12 : parseInt(timeParts[0]), // Hora
                parseInt(timeParts[1]) // Minutos
            );

            return itemDate >= startOfWeek && itemDate <= endOfWeek; // Filtrar por semana actual
        }).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()); // Ordenar por fecha
    } else if (timeline === "mes") {
        const weeksData: { [key: string]: { entrada: number; salida: number; } } = {};

        data.forEach(item => {
            if (!item.fecha) return false; // Verificar si fecha está definida

            const itemDateParts = item.fecha.split(" "); // Separar fecha y hora
            const dateParts = itemDateParts[0].split("/"); // Separar día, mes y año
            const timeParts = itemDateParts[1].split(":"); // Separar hora y minutos
            const isPM = itemDateParts[2] === "PM"; // Verificar si es PM

            // Convertir a objeto Date
            const itemDate = new Date(
                parseInt(dateParts[2]) + 2000, // Año
                parseInt(dateParts[1]) - 1, // Mes (0-11)
                parseInt(dateParts[0]), // Día
                isPM ? parseInt(timeParts[0]) + 12 : parseInt(timeParts[0]), // Hora
                parseInt(timeParts[1]) // Minutos
            );

            const weekNumber = Math.floor(itemDate.getDate() / 7); // Obtener número de semana del mes

            if (!weeksData[weekNumber]) {
                weeksData[weekNumber] = { entrada: 0, salida: 0 };
            }
            weeksData[weekNumber].entrada += item.entrada; // Sumar entradas
            weeksData[weekNumber].salida += item.salida; // Sumar salidas
        });

        const result = Object.entries(weeksData).map(([week, totals]) => ({
            semana: `Semana ${parseInt(week) + 1}`, // Formato de semana
            entrada: totals.entrada,
            salida: totals.salida,
        }));

        return result.sort((a, b) => a.semana.localeCompare(b.semana)); // Ordenar por semana
    }

    return data; // Retornar data ya ordenada
}

const ProductAnalitica = () => {
    const [chartType] = useState<'salida' | 'entrada' | 'ambos'>('ambos');
    const [timelineType] = useState<'semana' | 'mes'>('semana');

    const [timeline, setTimeline] = useState(timelineType);
    const [chart, setChart] = useState(chartType);

    const chartDataFake = [
        { fecha: "01/12/24 10:00 AM", entrada: 150, salida: 70 },
        { fecha: "05/12/24 11:30 AM", entrada: 200, salida: 90 },
        { fecha: "10/12/24 02:15 PM", entrada: 180, salida: 60 },
        { fecha: "15/12/24 09:45 AM", entrada: 220, salida: 110 },
        { fecha: "18/12/24 01:00 PM", entrada: 170, salida: 80 },
        { fecha: "17/12/24 01:00 PM", entrada: 170, salida: 80 },
        { fecha: "20/12/24 01:00 PM", entrada: 170, salida: 80 },
        { fecha: "25/12/24 03:30 PM", entrada: 250, salida: 130 },
        { fecha: "30/12/24 04:00 PM", entrada: 190, salida: 100 },
    ]

    const filteredChartData = filterChartData(chartDataFake, timeline) || [];


    return (
        <div className="w-full grid grid-cols-2 gap-x-5">
            <div className="col-start-1 col-end-2 mt-5">
                <ProductChart chart={chart} filteredChartData={filteredChartData} setChart={setChart} setTimeline={setTimeline} timeline={timeline} />
            </div>
            <div className="col-start-2 col-end-3 border-[1px] border-[#707070] rounded-lg mt-20">

                {
                    filteredChartData.map((data, index) => {
                        return (
                            <div
                                key={index}
                                className="grid grid-cols-4 w-full col-start-1 last-of-type:border-b-0 border-b-[1px] border-[#707070] col-end-4 items-center overflow-y-auto overflow-hidden py-5">

                                <div onClick={() => { }} className="col-start-1 cursor-pointer text-2xl col-end-2 pl-10 text-[#707070] font-semibold">
                                    {'fecha' in data ? data.fecha.slice(0, 8) : data.semana} {/* Verificación de tipo */}
                                </div>
                                {
                                    chart === "salida" || "ambos" &&
                                    (
                                        <div onClick={() => { }} className="col-start-2 cursor-pointer text-2xl col-end-3 pl-10 text-[#19AD0F] font-semibold">
                                            ${data.entrada}
                                        </div>
                                    )
                                }

                                {
                                    chart === "entrada" || "ambos" &&
                                    (
                                        <div onClick={() => { }} className="col-start-3 cursor-pointer text-2xl col-end-4 pl-10 text-[#DD1313] font-semibold">
                                            ${data.salida}
                                        </div>
                                    )
                                }

                                {
                                    chart === "ambos" &&
                                    (
                                        <div onClick={() => { }} className="col-start-4 cursor-pointer text-2xl col-end-5 pl-10 text-[#0077FF] font-semibold">
                                            ${data.entrada - data.salida}
                                        </div>
                                    )
                                }



                            </div>
                        );
                    })
                }

            </div>
        </div>
    )
}

export default ProductAnalitica
