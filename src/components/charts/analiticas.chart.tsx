import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Area, AreaChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"


interface ChartProps<T> {
    primaryColor: string,
    secondaryColor: string,
    type: 'pie' | 'bar' | 'area' | 'stacked',
    data: Array<T>,
    XDataKey?: string,
    YDataKey?: string,
    XAxisKey?: string,
    YAxisKey?: string,
}

const ChartYAxis = ({ YAxisKey }: { YAxisKey?: string }) => (
    YAxisKey ? (
        <YAxis
            dataKey={YAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
        />
    ) : null
);

const ChartXAxis = ({ XAxisKey }: { XAxisKey?: string }) => (
    <XAxis
        dataKey={XAxisKey}
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tickFormatter={(value) => value.slice(0, 9)}
    />
);

const AnaliticasChart = ({ primaryColor, secondaryColor, type, XAxisKey, XDataKey, YAxisKey, data,YDataKey }: ChartProps<{}>) => {
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: primaryColor,
        },
        mobile: {
            label: "Mobile",
            color: secondaryColor,
        },
    } satisfies ChartConfig


    if (type === "area") return (
        <ChartContainer config={chartConfig}>
            <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <YAxis
                    dataKey={YAxisKey}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                />
                <XAxis
                    dataKey={XAxisKey}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" hideLabel />}
                />
                <Area
                    dataKey={XDataKey!!}
                    type="linear"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                />
            </AreaChart>
        </ChartContainer>
    )

    if (type === 'stacked') return (
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              dataKey={YAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey={XDataKey!!}
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey={YDataKey!!}
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
    )

    if (type === 'bar') return (
        <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <ChartYAxis />
                <ChartXAxis />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey={XDataKey!!} fill="var(--color-desktop)" radius={4} />
            </BarChart>
        </ChartContainer>
    )

}

export default AnaliticasChart
