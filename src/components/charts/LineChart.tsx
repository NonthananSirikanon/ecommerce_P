import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LineChartProps {
  data: Array<{
    label: string;
    value: number;
    [key: string]: any;
  }>;
  title?: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  dataKey?: string;
  xAxisKey?: string;
  formatTooltip?: (value: number | string, name: string) => [string, string];
}

const CustomLineChart = ({ 
  data, 
  title, 
  height = 300, 
  color = '#3b82f6', 
  showGrid = true,
  showLegend = false,
  dataKey = 'value',
  xAxisKey = 'label',
  formatTooltip
}: LineChartProps) => {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const defaultFormatTooltip = (value: number | string, name: string) => {
    if (typeof value === 'number' && value > 10000) {
      return [formatCurrency(value), 'ยอดขาย'];
    }
    return [value.toLocaleString('th-TH'), name];
  };

  return (
    <div className="w-full">
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
          <XAxis 
            dataKey={xAxisKey} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => {
              if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`;
              } else if (value >= 1000) {
                return `${(value / 1000).toFixed(0)}K`;
              }
              return value.toString();
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={formatTooltip || defaultFormatTooltip}
          />
          {showLegend && <Legend />}
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;