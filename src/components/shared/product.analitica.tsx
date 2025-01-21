import { useEffect, useState } from "react";
import ProductChart from "../charts/product.chart"
import { useProductosStore, useStockStore } from "@/store/store";
import { useParams } from "react-router-dom";
import { formatDate } from "@/funcs";

const filterChartData = (
    data: { fecha: string; entrada: number; salida: number }[],
    timeline: 'semana' | 'mes'
) => {
    const currentDate = new Date();

    // Ordenar los datos por fecha antes de filtrar
    data.sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    if (timeline === "semana") {
        const startOfWeek = new Date(currentDate);
        // Domingo como inicio de semana, ajusta según tu necesidad
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return data
            .filter(item => {
                if (!item.fecha) return false;

                // Descomponer fecha
                const itemDateParts = item.fecha.split(" ");
                const dateParts = itemDateParts[0].split("/");
                const timeParts = itemDateParts[1].split(":");
                const isPM = itemDateParts[2] === "PM";

                const itemDate = new Date(
                    parseInt(dateParts[2]) + 2000,    // Año
                    parseInt(dateParts[1]) - 1,       // Mes
                    parseInt(dateParts[0]),           // Día
                    isPM ? parseInt(timeParts[0]) + 12 : parseInt(timeParts[0]),
                    parseInt(timeParts[1])            // Min
                );

                return itemDate >= startOfWeek && itemDate <= endOfWeek;
            })
            .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    }
    else if (timeline === "mes") {
        const weeksData: { [key: string]: { entrada: number; salida: number } } = {};

        data.forEach(item => {
            if (!item.fecha) return;

            const itemDateParts = item.fecha.split(" ");
            const dateParts = itemDateParts[0].split("/");
            const timeParts = itemDateParts[1].split(":");
            const isPM = itemDateParts[2] === "PM";

            const itemDate = new Date(
                parseInt(dateParts[2]) + 2000,
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[0]),
                isPM ? parseInt(timeParts[0]) + 12 : parseInt(timeParts[0]),
                parseInt(timeParts[1])
            );

            // Número de semana en el mes (simplificado)
            const weekNumber = Math.floor(itemDate.getDate() / 7);

            if (!weeksData[weekNumber]) {
                weeksData[weekNumber] = { entrada: 0, salida: 0 };
            }
            weeksData[weekNumber].entrada += item.entrada;
            weeksData[weekNumber].salida += item.salida;
        });

        const result = Object.entries(weeksData).map(([week, totals]) => ({
            semana: `Semana ${parseInt(week) + 1}`,
            entrada: totals.entrada,
            salida: totals.salida,
        }));

        return result.sort((a, b) => a.semana.localeCompare(b.semana));
    }

    return data;
};

const ProductAnalitica = ({ tipo }: { tipo: 'dia' | 'completo' }) => {
    const [chartType] = useState<'salida' | 'entrada' | 'ambos'>('ambos');
    const [timelineType] = useState<'semana' | 'mes'>('semana');
    const { id } = useParams();

    const [timeline, setTimeline] = useState(timelineType);
    const [chart, setChart] = useState(chartType);

    
    

    const stock = useStockStore((state) => state.stock);
    const productos = useProductosStore((s)=>s.productos)
    const cargarProduct = useProductosStore((s)=>s.cargarProduct)

    useEffect(() => {
        cargarProduct()
      }, [])

    // Filtro por producto y acumulamos
    const stockOfThisProduct = stock.filter(s => s.productoId === id);

    const groupedStockData = stockOfThisProduct.reduce(
        (acc, item) => {
            // "dd/mm/yy hh:mm AM/PM"
            const dateKey = item.fecha.split(" ")[0];
            if (!acc[dateKey]) {
                acc[dateKey] = { fecha: item.fecha, entrada: 0, salida: 0 };
            }

            const precioCompra = productos.find((product)=>product.id === id)?.precio ?? 0;
            const precioVenta = productos.find((product)=>product.id === id)?.total ?? 0;

            // --- Ajuste de lógica ---
            if (item.tipo === "compra") {
                // compra => entrada
                acc[dateKey].salida += item.cantidad * precioCompra;
            } else if (item.tipo === "venta") {
                // venta => salida
                acc[dateKey].entrada += item.cantidad * precioVenta;
            }

            return acc;
        },
        {} as Record<string, { fecha: string; entrada: number; salida: number }>
    );

    const transformedStockData = Object.values(groupedStockData);

    // Filtro por día o muestro todo
    const filteredData =
        tipo === "dia"
            ? transformedStockData.filter(item => {
                const today = new Date();
                return item.fecha.split(" ")[0] === formatDate(today).split(" ")[0];
            })
            : transformedStockData;

    // Aplicar el filtro adicional (semana | mes) para la gráfica
    const filteredChartData = filterChartData(filteredData, timeline) || [];

    return (
        <div className="w-full grid grid-cols-2 gap-x-5">
            {/* Gráfico */}
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

            {/* Tabla de datos */}
            <div
                className={`col-start-2 col-end-3 border-[1px] border-[#707070] rounded-lg ${tipo === "completo" ? "mt-20" : "mt-8"
                    }`}
            >
                {filteredChartData.map((data, index) => {
                    return (
                        <div
                            key={index}
                            className="grid grid-cols-4 w-full col-start-1 last-of-type:border-b-0 border-b-[1px] border-[#707070] col-end-4 items-center overflow-y-auto py-5"
                        >
                            {/* Fecha o Semana */}
                            <div
                                className="col-start-1 cursor-pointer text-2xl col-end-2 pl-10 text-[#707070] font-semibold"
                            >
                                {"fecha" in data
                                    ? data.fecha.slice(0, 8) // “dd/mm/yy” (si existe clave 'fecha')
                                    : data.semana // “Semana X” (en vista por mes)
                                }
                            </div>

                            {/* Entrada */}
                            {(chart === "salida" || chart === "ambos") && (
                                <div
                                    className="col-start-2 cursor-pointer text-2xl col-end-3 pl-10 text-[#19AD0F] font-semibold"
                                >
                                    ${data.entrada}
                                </div>
                            )}

                            {/* Salida */}
                            {(chart === "entrada" || chart === "ambos") && (
                                <div
                                    className="col-start-3 cursor-pointer text-2xl col-end-4 pl-10 text-[#DD1313] font-semibold"
                                >
                                    ${data.salida}
                                </div>
                            )}

                            {/* Diferencia (solo si "ambos") */}
                            {chart === "ambos" && (
                                <div
                                    className="col-start-4 cursor-pointer text-2xl col-end-5 pl-10 text-[#0077FF] font-semibold"
                                >
                                    ${data.entrada - data.salida}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductAnalitica;
