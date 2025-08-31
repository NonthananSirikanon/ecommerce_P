import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
    [key: string]: any;
  }>;
  title?: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  dataKey?: string;
  xAxisKey?: string;
  horizontal?: boolean;
  formatTooltip?: (value: number | string, name: string) => [string, string];
}

const CustomBarChart = ({ 
  data, 
  title, 
  height = 300, 
  color = '#3b82f6', 
  showGrid = true,
  showLegend = false,
  dataKey = 'value',
  xAxisKey = 'label',
  horizontal = false,
  formatTooltip
}: BarChartProps) => {
  
  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const defaultFormatTooltip = (value: number | string, name: string) => {
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
        <BarChart 
          data={data} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout={horizontal ? 'horizontal' : 'vertical'}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
          
          {horizontal ? (
            <>
              <XAxis 
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={formatNumber}
              />
              <YAxis 
                type="category"
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                width={100}
              />
            </>
          ) : (
            <>
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
                tickFormatter={formatNumber}
              />
            </>
          )}
          
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
          
          <Bar 
            dataKey={dataKey} 
            fill={color}
            radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;