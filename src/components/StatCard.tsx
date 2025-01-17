import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  change: number;
  icon: ReactNode;
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change}%
            <span className="text-gray-500 ml-2">vs last period</span>
          </p>
        </div>
      </div>
    </div>
  );
} 