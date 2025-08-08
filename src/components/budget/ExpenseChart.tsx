import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PieChart,
  BarChart3,
  Calendar,
  LineChartIcon,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const CHART_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#FF9F80",
  "#A8E6CF",
  "#FFD3B6",
  "#BEE1E6",
];

interface ChartDataItem {
  category: string;
  amount: number;
}

interface ExpenseChartProps {
  data?: {
    category: string;
    amount: number;
  }[];
  selectedView?: "pie" | "bar" | "line" | "trend" | "insights";
  selectedTimeframe?: "week" | "month" | "year";
}

const defaultData = [
  { category: "Groceries", amount: 5800 },
  { category: "Mantenimiento Casa", amount: 7000 },
  { category: "Entertainment", amount: 550 },
  { category: "Transportation", amount: 0 },
  { category: "Shopping", amount: 2999 },
  { category: "Doctores", amount: 2600 },
  { category: "Clases Extra", amount: 0 },
  { category: "Renta", amount: 0 },
  { category: "Juanis", amount: 4000 },
];

const ExpenseChart = ({
  data = defaultData,
  selectedView = "pie",
  selectedTimeframe = "month",
}: ExpenseChartProps) => {
  const { t } = useTranslation();
  const safeData = data || defaultData;
  const filteredData = safeData.filter(item => item && item.amount > 0);
  const total = filteredData.reduce((sum, item) => sum + item.amount, 0);

  // Generate mock trend data
  const generateTrendData = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push({
        date,
        amount: Math.random() * 1000 + 500,
      });
    }
    return dates;
  };

  const trendData = generateTrendData();

  // Calculate month-over-month changes
  const previousMonthTotal = total * 0.9; // Mock data
  const monthOverMonthChange =
    ((total - previousMonthTotal) / previousMonthTotal) * 100;

  // Calculate category insights
  const categoryInsights = filteredData.map((item) => ({
    ...item,
    percentage: (item.amount / total) * 100,
    change: Math.random() * 40 - 20, // Mock month-over-month change
  }));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with controls - Properly contained */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-600">Expense Analysis</h3>
          <Badge variant="secondary" className="text-xs">
            ${total.toLocaleString()} total
          </Badge>
        </div>
        <Select defaultValue={selectedView}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">Category Split</SelectItem>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="insights">Insights</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart Content - Contained with proper scrolling */}
      <div className="flex-1 overflow-hidden">
        {selectedView === "pie" && (
          <div className="h-full flex flex-col">
            {/* Pie Chart */}
            <div className="flex-1 flex items-center justify-center min-h-0">
              <div className="relative">
                <div
                  className="w-48 h-48 rounded-full shadow-lg border-4 border-white"
                  style={{
                    background: filteredData.length > 0 && total > 0 ? `conic-gradient(${filteredData
                      .map((item, index) => {
                        const startPercentage = filteredData
                          .slice(0, index)
                          .reduce((sum, d) => sum + (d.amount / total) * 100, 0);
                        const endPercentage = startPercentage + (item.amount / total) * 100;
                        return `${CHART_COLORS[index % CHART_COLORS.length]} ${startPercentage}% ${endPercentage}%`;
                      })
                      .join(",")})` : '#f3f4f6',
                  }}
                >
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">${total.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Total Spent</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Legend - Scrollable */}
            <div className="mt-4">
              <ScrollArea className="h-32">
                <div className="grid grid-cols-2 gap-2 pr-2">
                  {filteredData
                    .map((item, index) => {
                      const percentage = ((item.amount / total) * 100).toFixed(1);
                      return (
                        <div key={item.category} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">{item.category}</p>
                            <p className="text-xs text-gray-600">${item.amount.toLocaleString()} ({percentage}%)</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {selectedView === "bar" && (
          <div className="h-full flex flex-col">
            <div className="flex-1 flex items-end justify-between gap-2 p-4 min-h-0">
              {filteredData
                .slice(0, 6) // Limit bars to fit properly
                .map((item, index) => {
                  const maxAmount = Math.max(...filteredData.map((d) => d.amount));
                  const heightPercentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                  const barHeight = Math.max((heightPercentage * 200) / 100, 8);
                  return (
                    <div key={item.category} className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                      <div className="text-xs font-medium text-gray-900">
                        ${item.amount.toLocaleString()}
                      </div>
                      <div
                        className="w-full rounded-t-lg transition-all duration-300 min-h-[8px]"
                        style={{
                          height: `${barHeight}px`,
                          backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                      <div className="text-xs text-gray-600 text-center truncate w-full">
                        {item.category}
                      </div>
                    </div>
                  );
                })}
            </div>
            {filteredData.length > 6 && (
              <div className="text-xs text-gray-500 text-center p-2">
                Showing top 6 categories
              </div>
            )}
          </div>
        )}

        {selectedView === "insights" && (
          <ScrollArea className="h-full pr-2">
            <div className="space-y-3">
              {filteredData.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <PieChart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">No expenses yet</h3>
                  <p className="text-sm">Add some expenses to see insights</p>
                </div>
              ) : (
                categoryInsights
                  .map((item, index) => (
                    <div key={item.category} className="p-4 border border-gray-200 rounded-xl bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          />
                          <span className="font-medium text-gray-900">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          {item.change >= 0 ? (
                            <ArrowUpRight className="w-3 h-3 text-red-500" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-green-500" />
                          )}
                          <span
                            className={`font-medium ${item.change >= 0 ? "text-red-600" : "text-green-600"}`}
                          >
                            {Math.abs(item.change).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="mb-2">
                        <Progress
                          value={item.percentage}
                          className="h-2"
                          style={{
                            backgroundColor: `${CHART_COLORS[index % CHART_COLORS.length]}20`
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          ${item.amount.toLocaleString()}
                        </span>
                        <span className="font-medium text-gray-900">
                          {item.percentage.toFixed(1)}% of total
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;
