import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
    [key: string]: any;
  }>;
  title?: string;
  height?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  formatTooltip?: (value: number | string, name: string) => [string, string];
}

const CustomPieChart = ({ 
  data, 
  title, 
  height = 300, 
  showLegend = true,
  showLabels = true,
  innerRadius = 0,
  outerRadius = 100,
  formatTooltip
}: PieChartProps) => {
  
  const COLORS = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
    '#ec4899', // pink
    '#6b7280'  // gray
  ];

  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }));

  const defaultFormatTooltip = (value: number | string, name: string) => {
    const percentage = ((value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
    return [`${value.toLocaleString('th-TH')} (${percentage}%)`, name];
  };

  const renderLabel = (entry: { value: number }) => {
    if (!showLabels) return null;
    const percentage = ((entry.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
    return `${percentage}%`;
  };

  const renderLegend = (props: { payload: Array<{ value: string; color: string }> }) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={dataWithColors}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={formatTooltip || defaultFormatTooltip}
          />
          
          {showLegend && (
            <Legend content={renderLegend} />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;