import React from "react";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  PieChart,
  BarChart3,
  Calendar,
  LineChart as LineChartIcon,
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
} from "../ui/select";
import { Progress } from "../ui/progress";
import LineChart from "./charts/LineChart";

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
  const total = data.reduce((sum, item) => sum + item.amount, 0);

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
  const categoryInsights = data.map((item) => ({
    ...item,
    percentage: (item.amount / total) * 100,
    change: Math.random() * 40 - 20, // Mock month-over-month change
  }));

  return (
    <Card className="p-6 w-full h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Expense Breakdown
        </h2>
        <div className="flex gap-4">
          <Select defaultValue={selectedTimeframe}>
            <SelectTrigger className="w-[120px] flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue={selectedView} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pie" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" /> Category Split
          </TabsTrigger>
          <TabsTrigger value="bar" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Amount by Category
          </TabsTrigger>
          <TabsTrigger value="line" className="flex items-center gap-2">
            <LineChartIcon className="w-4 h-4" /> Daily Spending
          </TabsTrigger>
          <TabsTrigger value="trend" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Trends
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Target className="w-4 h-4" /> Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pie" className="h-[250px]">
          <div className="relative w-full h-[180px] flex items-center justify-center">
            <div
              className="w-[180px] h-[180px] rounded-full relative overflow-hidden shadow-lg"
              style={{
                background: `conic-gradient(${data
                  .filter((item) => item.amount > 0)
                  .map((item, index) => {
                    const colors = [
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
                    const startPercentage = data
                      .filter((d) => d.amount > 0)
                      .slice(0, index)
                      .reduce((sum, d) => sum + (d.amount / total) * 100, 0);
                    const percentage = (item.amount / total) * 100;
                    return `${colors[index % colors.length]} ${startPercentage}% ${startPercentage + percentage}%`;
                  })
                  .join(",")})`,
              }}
            />
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {data
              .filter((item) => item.amount > 0)
              .map((item, index) => {
                const colors = [
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
                return (
                  <div key={item.category} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.category} (
                      {((item.amount / total) * 100).toFixed(1)}
                      %)
                    </span>
                  </div>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="bar" className="h-[250px]">
          <div className="w-full h-full flex items-end justify-between gap-4 pt-8">
            {data
              .filter((item) => item.amount > 0)
              .map((item, index) => {
                const colors = [
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
                const maxAmount = Math.max(...data.map((d) => d.amount));
                const heightPercentage = (item.amount / maxAmount) * 100;
                const barHeight = Math.max((heightPercentage * 180) / 100, 20);
                return (
                  <div
                    key={item.category}
                    className="flex flex-col items-center gap-2 flex-1"
                  >
                    <div
                      className="w-full rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${barHeight}px`,
                        backgroundColor: colors[index % colors.length],
                      }}
                    />
                    <span className="text-sm text-center whitespace-nowrap overflow-hidden text-ellipsis w-full text-muted-foreground">
                      {item.category}
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="line" className="h-[250px]">
          <LineChart data={trendData} width={700} height={250} />
        </TabsContent>

        <TabsContent value="trend" className="h-[250px]">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <h3 className="font-medium">Month-over-Month</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Spending
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${monthOverMonthChange >= 0 ? "text-red-500" : "text-green-500"}`}
                    >
                      {monthOverMonthChange >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 inline" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 inline" />
                      )}
                      {Math.abs(monthOverMonthChange).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={Math.abs(monthOverMonthChange)}
                  className="h-2"
                  indicatorClassName={
                    monthOverMonthChange >= 0 ? "bg-red-500" : "bg-green-500"
                  }
                />
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-blue-500" />
                <h3 className="font-medium">Spending Summary</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Spent
                  </span>
                  <span className="font-medium">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Avg per Category
                  </span>
                  <span className="font-medium">
                    ${(total / data.length).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="h-[250px] overflow-auto">
          <div className="space-y-4">
            {categoryInsights
              .filter((item) => item.amount > 0)
              .map((item, index) => (
                <div key={item.category} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.category}</span>
                    <span
                      className={`text-sm ${item.change >= 0 ? "text-red-500" : "text-green-500"}`}
                    >
                      {item.change >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 inline" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 inline" />
                      )}
                      {Math.abs(item.change).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={item.percentage}
                    className="h-2"
                    indicatorClassName={`bg-[${["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD", "#FF9F80", "#A8E6CF", "#FFD3B6", "#BEE1E6"][index % 9]}]`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-muted-foreground">
                      ${item.amount.toLocaleString()} (
                      {item.percentage.toFixed(1)}% of total)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ExpenseChart;
