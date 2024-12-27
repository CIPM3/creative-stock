import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Arrow } from "@/assets/svg"

const chartConfig = {
    entrada: {
        label: "Entrada",
        color: "hsl(var(--chart-1))",
    },
    salida: {
        label: "Salida",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

interface Props {
    timeline: 'semana' | 'mes', // Especificar los tipos permitidos
    setTimeline: (timeline: 'semana' | 'mes') => void, // Asegúrate de que el tipo coincida
    chart: 'salida' | 'entrada' | 'ambos',
    setChart: (chart: 'salida' | 'entrada' | 'ambos') => void,
    filteredChartData: any[], // Cambia 'any' por el tipo adecuado si lo conoces
    tipo: 'dia' | 'completo'
}

const ProductChart = ({ timeline, setTimeline, chart, setChart, filteredChartData, tipo }: Props) => {
    return (
        <div className="w-full ">
            {
                tipo === "completo" && (
                    <div className="w-full flex justify-end gap-x-1">
                        <button onClick={() => setTimeline("semana")} className={`
                    first-letter:uppercase px-8 py-3 border-[1px] 
                    ${timeline === "semana"
                                ? "border-[#336EB1] text-[#336EB1] bg-[#D8E5F3]"
                                : "border-[#707070] text-[#707070] bg-[#EAEAEA]"} 
                    rounded-lg`}>semana</button>
                        <button onClick={() => setTimeline("mes")} className={`
                    first-letter:uppercase px-8 py-3 border-[1px] 
                    ${timeline === "mes"
                                ? "border-[#336EB1] text-[#336EB1] bg-[#D8E5F3]"
                                : "border-[#707070] text-[#707070] bg-[#EAEAEA]"} 
                    rounded-lg`}>mes</button>
                    </div>
                )
            }


            <div className="border-[1px] border-[#707070] rounded-lg mt-3">
                <div className="w-full flex justify-end py-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none border-[1px] border-[#707070] gap-x-4 text-lg px-4 mr-5 py-1.5 rounded-lg
                         flex items-center ">
                            <span className="first-letter:uppercase">{chart}</span> <Arrow className="size-2 fill-black" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="py-2 px-3" onClick={() => setChart("salida")}>Por salida</DropdownMenuItem>
                            <DropdownMenuItem className="py-2 px-3" onClick={() => setChart("entrada")}>Por entrada</DropdownMenuItem>
                            <DropdownMenuItem className="py-2 px-3" onClick={() => setChart("ambos")}>ambos</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>

                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={filteredChartData}>
                        <CartesianGrid vertical={false} />
                        <YAxis
                            dataKey="entrada"
                            tickFormatter={(value) => value}
                        />
                        <XAxis
                            dataKey={timeline === "semana" ? 'fecha' : "semana"}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => timeline === "semana" ? value.slice(0, 8) : value}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        {chart === "ambos" && (
                            <>
                                <Bar dataKey="entrada" className="fill-[#19AD0F]" fill="var(--color-desktop)" radius={4} />
                                <Bar dataKey="salida" className="fill-[#DD1313]" fill="var(--color-mobile)" radius={4} />
                            </>
                        )}
                        {
                            chart === "entrada" && (
                                <Bar dataKey="entrada" className="fill-[#19AD0F]" fill="var(--color-desktop)" radius={4} />
                            )
                        }

                        {
                            chart === "salida" && (
                                <Bar dataKey="salida" className="fill-[#DD1313]" fill="var(--color-mobile)" radius={4} />
                            )
                        }

                    </BarChart>
                </ChartContainer>

            </div>

        </div>
    )
}

export default ProductChart
