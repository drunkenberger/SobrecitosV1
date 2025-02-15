import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function Home() {
  const { t } = useTranslation();
  
  // TODO: Replace with actual data from your state management
  const totalBudget = 5000;
  const spentAmount = 3250;
  const remainingBalance = totalBudget - spentAmount;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-[#556B2F] p-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/logo.svg" alt="Sobrecitos" className="h-12 w-12" />
              <div>
                <h1 className="text-xl font-bold text-white">{t('dashboard.header.title')}</h1>
                <p className="text-white/80">{t('dashboard.header.subtitle')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="warning">
                {t('dashboard.header.buttons.exportData')}
              </Button>
              <Button variant="warning">
                {t('dashboard.header.buttons.importData')}
              </Button>
              <Button variant="warning">
                {t('dashboard.header.buttons.aiInsights')}
              </Button>
              <Button variant="warning">
                {t('dashboard.header.buttons.addExpense')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Alerts */}
        <div className="space-y-2">
          <div className="alert">
            <AlertCircle className="h-4 w-4" />
            <h4>{t('dashboard.alerts.utilities.title')}</h4>
            <p>{t('dashboard.alerts.utilities.message', { percent: 84 })}</p>
          </div>
          <div className="alert">
            <AlertCircle className="h-4 w-4" />
            <h4>{t('dashboard.alerts.salad.title')}</h4>
            <p>{t('dashboard.alerts.salad.message', { percent: 171 })}</p>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.overview.totalBudget')}</CardTitle>
              <CardDescription>${totalBudget}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.overview.spentAmount')}</CardTitle>
              <CardDescription>${spentAmount}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.overview.remainingBalance')}</CardTitle>
              <CardDescription>${remainingBalance}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{t('dashboard.expenseBreakdown.title')}</CardTitle>
              <Select>
                <SelectTrigger>
                  <SelectValue>{t('dashboard.expenseBreakdown.period')}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="categorySplit">
                    {t('dashboard.expenseBreakdown.tabs.categorySplit')}
                  </SelectItem>
                  <SelectItem value="amountByCategory">
                    {t('dashboard.expenseBreakdown.tabs.amountByCategory')}
                  </SelectItem>
                  <SelectItem value="dailySpending">
                    {t('dashboard.expenseBreakdown.tabs.dailySpending')}
                  </SelectItem>
                  <SelectItem value="trends">
                    {t('dashboard.expenseBreakdown.tabs.trends')}
                  </SelectItem>
                  <SelectItem value="insights">
                    {t('dashboard.expenseBreakdown.tabs.insights')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {/* Chart component */}
            <div className="flex justify-center gap-4 mt-4">
              <span>{t('dashboard.categories.groceries')} (1.5%)</span>
              <span>{t('dashboard.categories.utilities')} (25.3%)</span>
              <span>{t('dashboard.categories.entertainment')} (6.1%)</span>
              <span>{t('dashboard.categories.salad')} (67.1%)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 