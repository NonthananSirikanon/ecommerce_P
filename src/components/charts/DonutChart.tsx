import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
    [key: string]: any;
  }>;
  title?: string;
  height?: number;
  centerText?: string;
  centerSubtext?: string;
  formatTooltip?: (value: number | string, name: string) => [string, string];
}

const DonutChart = ({ 
  data, 
  title, 
  height = 300, 
  centerText,
  centerSubtext,
  formatTooltip
}: DonutChartProps) => {
  
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

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const defaultFormatTooltip = (value: number | string, name: string) => {
    const percentage = ((value / totalValue) * 100).toFixed(1);
    return [`${value.toLocaleString('th-TH')} (${percentage}%)`, name];
  };

  return (
    <div className="w-full">
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      
      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={dataWithColors}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
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
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        {(centerText || centerSubtext) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {centerText && (
                <div className="text-2xl font-bold text-gray-900">{centerText}</div>
              )}
              {centerSubtext && (
                <div className="text-sm text-gray-600">{centerSubtext}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {dataWithColors.map((item, index) => {
          const percentage = ((item.value / totalValue) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500">
                  {item.value.toLocaleString('th-TH')} ({percentage}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonutChart;