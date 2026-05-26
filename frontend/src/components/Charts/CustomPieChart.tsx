import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';
import CustomTooltip from './CustomTooltip';

const CustomPieChart = ({data,colors}: {data: {status: string, count: number}[], colors: string[]}) => {
  return (
    <ResponsiveContainer width="100%" height={325}>
        <PieChart>
            <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={130}
                innerRadius={100}
                labelLine={false}
            >{data.map((_entry,index) => (<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />))}
            </Pie>
            <Tooltip  content={<CustomTooltip />}/>
            <Legend />
        </PieChart>
    </ResponsiveContainer>
  )
}

export default CustomPieChart