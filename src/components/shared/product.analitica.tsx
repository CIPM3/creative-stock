import { useState } from "react";
import ProductChart from "../charts/product.chart"
import { useStockStore,usePreciosStore } from "@/store/store";
import { useParams } from "react-router-dom";
import { formatDate } from "@/funcs";


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

const ProductAnalitica = ({ tipo }: { tipo: 'dia' | 'completo' }) => {
    const [chartType] = useState<'salida' | 'entrada' | 'ambos'>('ambos');
    const [timelineType] = useState<'semana' | 'mes'>('semana');
    const {id} = useParams()

    const [timeline, setTimeline] = useState(timelineType);
    const [chart, setChart] = useState(chartType);

    const stock = useStockStore((state) => state.stock)
    const precios = usePreciosStore((state)=> state.precios)

    const preciosOfProduct = precios.find((precio) => precio.productId === id)

    // Agrupar y transformar los datos del stock al formato deseado
    const groupedStockData = stock.reduce((acc: Record<string, { fecha: string; entrada: number; salida: number }>, item) => {
        const dateKey = item.fecha.split(" ")[0]; // Obtener solo la parte de la fecha (sin la hora)
        
        if (!acc[dateKey]) {
            acc[dateKey] = { fecha: item.fecha, entrada: 0, salida: 0 };
        }

        const precioCompra = preciosOfProduct?.precioCompra ?? 0; // Asegurar que no sea undefined
        const precioVenta = preciosOfProduct?.precioVenta ?? 0; // Asegurar que no sea undefined

        acc[dateKey].entrada += item.tipo === "venta" ? item.cantidad * precioCompra : 0;
        acc[dateKey].salida += item.tipo === "compra" ? item.cantidad * precioVenta : 0;

        return acc;
    }, {} as Record<string, { fecha: string; entrada: number; salida: number }>);

    // Convertir el objeto agrupado en un arreglo
    const transformedStockData = Object.values(groupedStockData);

    // Filtrar los datos según el tipo
    const filteredData = tipo === 'dia'
        ? transformedStockData.filter(item => {
            const today = new Date();
            return item.fecha.split(" ")[0] === formatDate(today).split(" ")[0];
        })
        : transformedStockData;

    const filteredChartData = filterChartData(filteredData, timeline) || [];

    return (
        <div className="w-full grid grid-cols-2 gap-x-5">
            <div className="col-start-1 col-end-2 mt-5">
                <ProductChart 
                chart={chart} 
                filteredChartData={filteredChartData} 
                setChart={setChart} 
                setTimeline={setTimeline} 
                timeline={timeline} 
                tipo={tipo}
                />
            </div>
            <div className={`col-start-2 col-end-3 border-[1px] border-[#707070] rounded-lg ${tipo === "completo" ? 'mt-20' : 'mt-8'} `}>

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
