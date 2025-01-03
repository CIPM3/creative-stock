import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Cita } from "@/types"

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#19AD0F",
    },
    mobile: {
        label: "Mobile",
        color: "#DD1313",
    },
} satisfies ChartConfig

interface chartProps {
    data: { fecha: string; citas: number }[]
}

const ServiceChart = ({data}:chartProps) => {
    return (
        <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <YAxis
                    dataKey={'citas'}
                />
                <XAxis
                    dataKey="fecha"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 8)}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="citas" fill="var(--color-desktop)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}

export default ServiceChart
