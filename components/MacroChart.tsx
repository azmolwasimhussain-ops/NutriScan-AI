import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { NutritionData, ChartData } from '../types';

interface MacroChartProps {
  nutrition: NutritionData;
}

const MacroChart: React.FC<MacroChartProps> = ({ nutrition }) => {
  const data: ChartData[] = [
    { name: 'Protein', value: nutrition.protein, fill: '#10B981' }, // Emerald-500
    { name: 'Carbs', value: nutrition.carbs, fill: '#F59E0B' },   // Amber-500
    { name: 'Fats', value: nutrition.fats, fill: '#EF4444' },     // Red-500
  ];

  return (
    <div className="h-64 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}g`, '']}
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#374151', fontWeight: 600 }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroChart;