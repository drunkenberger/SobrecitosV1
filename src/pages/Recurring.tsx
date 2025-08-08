import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import { Clock, Plus, Calendar, DollarSign, Trash2, Edit2, Play, Pause } from 'lucide-react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  isActive: boolean;
  nextDate: string;
  description?: string;
}

export default function Recurring() {
  const { t } = useTranslation();
  const { categories } = useStore();
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([
    // Sample data - in real app this would come from store
    {
      id: '1',
      name: 'Rent',
      amount: 1200,
      category: 'Housing',
      frequency: 'monthly',
      startDate: '2024-01-01',
      isActive: true,
      nextDate: '2024-02-01',
      description: 'Monthly rent payment'
    },
    {
      id: '2', 
      name: 'Netflix Subscription',
      amount: 15.99,
      category: 'Entertainment',
      frequency: 'monthly',
      startDate: '2024-01-15',
      isActive: true,
      nextDate: '2024-02-15'
    },
    {
      id: '3',
      name: 'Gym Membership',
      amount: 45,
      category: 'Health',
      frequency: 'monthly',
      startDate: '2024-01-01',
      isActive: false,
      nextDate: '2024-02-01'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      weekly: 'Weekly',
      biweekly: 'Bi-weekly', 
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly'
    };
    return labels[frequency] || frequency;
  };

  const getFrequencyColor = (frequency: string) => {
    const colors = {
      weekly: 'bg-blue-100 text-blue-700',
      biweekly: 'bg-purple-100 text-purple-700',
      monthly: 'bg-green-100 text-green-700',
      quarterly: 'bg-orange-100 text-orange-700',
      yearly: 'bg-red-100 text-red-700'
    };
    return colors[frequency] || 'bg-gray-100 text-gray-700';
  };

  const calculateMonthlyTotal = () => {
    return recurringExpenses
      .filter(expense => expense.isActive)
      .reduce((total, expense) => {
        const multiplier = {
          weekly: 4.33,
          biweekly: 2.17,
          monthly: 1,
          quarterly: 0.33,
          yearly: 0.083
        };
        return total + (expense.amount * multiplier[expense.frequency]);
      }, 0);
  };

  const upcomingExpenses = recurringExpenses
    .filter(expense => expense.isActive)
    .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())
    .slice(0, 5);

  const toggleExpense = (id: string) => {
    setRecurringExpenses(prev =>
      prev.map(expense =>
        expense.id === id ? { ...expense, isActive: !expense.isActive } : expense
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Clock className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('navigation.recurring')}
          </h1>
          <p className="text-gray-600">
            Manage your recurring expenses and subscriptions
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Monthly
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Recurring</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculateMonthlyTotal())}</p>
          </div>
        </Card>

        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Active Expenses</p>
            <p className="text-2xl font-bold text-gray-900">
              {recurringExpenses.filter(e => e.isActive).length}
            </p>
          </div>
        </Card>

        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              Next 7 days
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Due Soon</p>
            <p className="text-2xl font-bold text-gray-900">
              {upcomingExpenses.filter(e => 
                new Date(e.nextDate) <= addDays(new Date(), 7)
              ).length}
            </p>
          </div>
        </Card>

        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Pause className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              Paused
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Inactive</p>
            <p className="text-2xl font-bold text-gray-900">
              {recurringExpenses.filter(e => !e.isActive).length}
            </p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recurring Expenses List */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-lg border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-100 rounded-lg">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recurring Expenses</h3>
                    <p className="text-sm text-gray-600">Manage your automatic expenses</p>
                  </div>
                </div>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Recurring
                </Button>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {recurringExpenses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="font-medium text-gray-900 mb-2">No recurring expenses</h3>
                    <p className="text-sm">Add recurring expenses to automate your budget tracking</p>
                  </div>
                ) : (
                  recurringExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className={`group p-4 border rounded-xl transition-all duration-200 ${
                        expense.isActive 
                          ? 'border-gray-200 bg-white hover:shadow-md' 
                          : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1">
                            <h4 className={`font-medium ${expense.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                              {expense.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getFrequencyColor(expense.frequency)}>
                                {getFrequencyLabel(expense.frequency)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {expense.category}
                              </Badge>
                              {!expense.isActive && (
                                <Badge variant="secondary" className="text-xs">
                                  Paused
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className={`font-medium ${expense.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                              {formatCurrency(expense.amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Next: {format(new Date(expense.nextDate), 'MMM dd')}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleExpense(expense.id)}
                              className="h-8 w-8 p-0"
                            >
                              {expense.isActive ? (
                                <Pause className="h-3 w-3 text-orange-600" />
                              ) : (
                                <Play className="h-3 w-3 text-green-600" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {expense.description && (
                        <p className="text-sm text-gray-600 mt-2">{expense.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Expenses */}
        <div>
          <Card className="bg-white shadow-lg border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2.5 bg-orange-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming</h3>
                  <p className="text-sm text-gray-600">Next 30 days</p>
                </div>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {upcomingExpenses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No upcoming expenses</p>
                  </div>
                ) : (
                  upcomingExpenses.map((expense) => {
                    const nextDate = new Date(expense.nextDate);
                    const daysUntil = Math.ceil((nextDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                    
                    return (
                      <div key={expense.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{expense.name}</p>
                            <p className="text-xs text-gray-500">
                              {daysUntil === 0 ? 'Today' : 
                               daysUntil === 1 ? 'Tomorrow' : 
                               `in ${daysUntil} days`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(expense.amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(nextDate, 'MMM dd')}
                            </p>
                          </div>
                        </div>
                        <div className={`h-1 rounded-full ${
                          daysUntil <= 1 ? 'bg-red-200' :
                          daysUntil <= 7 ? 'bg-orange-200' :
                          'bg-green-200'
                        }`} />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}