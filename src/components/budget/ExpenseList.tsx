import React from "react";
import { useTranslation } from 'react-i18next';
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Receipt, Clock, X, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { formatDistanceToNow } from "date-fns";
import { es } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  currency?: {
    code: string;
    symbol: string;
    name: string;
  };
}

interface ExpenseListProps {
  expenses?: Expense[];
  onDeleteExpense?: (id: string) => void;
  categories?: Array<{ id: string; name: string; color: string }>;
}

const ExpenseList = ({
  expenses = [],
  onDeleteExpense,
  categories = [],
}: ExpenseListProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"date" | "amount">("date");
  const [minAmount, setMinAmount] = React.useState("");
  const [maxAmount, setMaxAmount] = React.useState("");

  const filteredExpenses = expenses
    .filter((expense) => {
      const matchesSearch = expense.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || expense.category === selectedCategory;
      const matchesAmount =
        (!minAmount || expense.amount >= Number(minAmount)) &&
        (!maxAmount || expense.amount <= Number(maxAmount));
      return matchesSearch && matchesCategory && matchesAmount;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return b.date.getTime() - a.date.getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  return (
    <Card className="w-full h-[600px] p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
            <Receipt className="w-5 h-5" /> {t('dashboard.transactions.title')}
          </h2>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as "date" | "amount")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('dashboard.transactions.sortByDate')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">{t('dashboard.transactions.sortByDate')}</SelectItem>
              <SelectItem value="amount">{t('dashboard.transactions.sortByAmount')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="expense-search"
              name="expense-search"
              placeholder={t('dashboard.transactions.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t('dashboard.transactions.allCategories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('dashboard.transactions.allCategories')}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {t(`dashboard.categories.${category.name.toLowerCase()}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder={t('dashboard.transactions.filters.minAmount')}
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-[150px]"
          />
          <Input
            type="number"
            placeholder={t('dashboard.transactions.filters.maxAmount')}
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="w-[150px]"
          />
          {(minAmount ||
            maxAmount ||
            selectedCategory !== "all" ||
            searchTerm) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setMinAmount("");
                setMaxAmount("");
                setSelectedCategory("all");
                setSearchTerm("");
              }}
              title={t('dashboard.transactions.filters.clearFilters')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {filteredExpenses.map((expense) => {
              const category = categories.find(
                (cat) => cat.name === expense.category,
              );

              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {expense.description}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(expense.date, { 
                        addSuffix: true, 
                        locale: t('language') === 'es' ? es : undefined 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      style={{
                        backgroundColor: category?.color || "#666",
                        color: "white",
                      }}
                    >
                      {t(`dashboard.categories.${expense.category.toLowerCase()}`)}
                    </Badge>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">
                        {expense.currency?.symbol || "$"}
                        {expense.amount.toFixed(2)}{" "}
                        {expense.currency?.code !== "USD"
                          ? expense.currency?.code
                          : ""}
                      </span>
                      {onDeleteExpense && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeleteExpense(expense.id)}
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredExpenses.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                {t('dashboard.transactions.noExpensesFound')}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default ExpenseList;
