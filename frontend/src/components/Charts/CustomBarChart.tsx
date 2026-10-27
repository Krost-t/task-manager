import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import type { Payload } from 'recharts/types/component/DefaultTooltipContent';

const getBarColor = (priority: string) => {
    switch (priority) {
        case 'Low':
            return '#00BC7D';
        case 'Medium':
            return '#FE9900';
        case 'High':
            return '#FF1F57';
        default:
            return '#00BC7D';
    }
}

const BarTooltip = ({ active, payload }: { active?: boolean, payload?: Payload[] }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                <p className="text-xs font-semibold text-purple-800 mb-1">{payload[0].payload?.priority}</p>
                <p className="text-sm font-medium">
                    Count: <span className="text-sm font-medium text-gray-900">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
}

const CustomBarChart = ({ data }: { data: { priority: string, count: number }[] }) => {
  return (
    <div className="bg-white mt-6">
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid stroke="none" />

                <XAxis
                    dataKey="priority"
                    tick={{ fontSize: 12, fill: '#555' }}
                    stroke="none"
                />
                <YAxis
                    tick={{ fontSize: 12, fill: '#555' }}
                    stroke="none"
                    allowDecimals={false}
                />

                <Tooltip content={<BarTooltip />} cursor={{ fill: 'transparent' }} />

                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.priority)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

export default CustomBarChart
