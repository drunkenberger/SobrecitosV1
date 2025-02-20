import * as React from 'react';

interface ChartData {
  category: string;
  amount: number;
}

interface ExpenseChartProps {
  data: ChartData[];
  selectedView: 'pie' | 'bar';
  selectedTimeframe: 'week' | 'month' | 'year';
}

type ColorMap = {
  [key: string]: string;
};

export function ExpenseChart({ 
  data,
  // Keep props in interface for future use but mark as unused for now
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedView,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedTimeframe 
}: ExpenseChartProps): React.ReactElement {
  const colors: ColorMap = {
    Groceries: '#FF6B6B',     // Red for Groceries
    Utilities: '#4ECDC4',     // Turquoise for Utilities
    Entertainment: '#45B7D1',  // Light blue for Entertainment
    Salud: '#96CEB4',         // Mint green for Health
    Other: '#607D8B'
  };

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  // Calculate percentages for each category
  const getPercentage = (amount: number): string => {
    return ((amount / total) * 100).toFixed(1);
  };

  return (
    <div className="relative w-full" style={{ height: '400px' }}>
      <div className="absolute inset-0">
        {/* Pie chart will go here */}
      </div>

      {/* Category labels in scrollable column */}
      <div className="absolute left-4 top-0 bottom-0 w-48 overflow-y-auto">
        <div className="space-y-2 py-2">
          {data.map((item) => (
            <div key={item.category} className="inline-flex items-center">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: colors[item.category] || colors.Other }} 
              />
              <span className="ml-1 text-xs">
                {item.category} ({getPercentage(item.amount)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 