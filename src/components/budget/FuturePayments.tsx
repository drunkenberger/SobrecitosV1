import { Button } from "@/components/ui/button";
import { Calendar, CalendarIcon, Clock, DollarSign, Plus, List, Grid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { format, parseISO, isValid, isBefore, isAfter, addDays } from "date-fns";
import { es } from 'date-fns/locale';
import type { Category } from "@/lib/store";
import { AddFuturePaymentDialog } from "./AddFuturePaymentDialog";
import { FuturePaymentsCalendar } from "./FuturePaymentsCalendar";

interface FuturePayment {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid?: boolean;
}

interface FuturePaymentsProps {
  payments?: FuturePayment[];
  categories?: Category[];
  onAddPayment: (payment: Omit<FuturePayment, "id" | "isPaid">) => Promise<void>;
  onUpdatePayment: (id: string, updates: Partial<FuturePayment>) => Promise<void>;
}

export default function FuturePayments({
  payments = [],
  categories = [],
  onAddPayment,
  onUpdatePayment,
}: FuturePaymentsProps) {
  const { t, i18n } = useTranslation();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Safe locale getter with error handling
  const getLocale = (language: string) => {
    try {
      if (language === 'es') {
        return es;
      }
      return undefined;
    } catch (error) {
      console.error('Error getting locale:', error);
      return undefined;
    }
  };

  // Safe date formatter with validation
  const formatDate = (dateString: string, formatStr: string = 'PP') => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        throw new Error('Invalid date');
      }
      return format(date, formatStr, { locale: getLocale(i18n.language) });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Calculate stats
  const now = new Date();
  const nextWeek = addDays(now, 7);
  
  const totalUpcoming = payments
    .filter((payment) => !payment.isPaid && payment.amount && typeof payment.amount === 'number')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const upcomingPayments = payments
    .filter(p => {
      try {
        const dueDate = parseISO(p.dueDate);
        return !p.isPaid && isValid(dueDate) && isAfter(dueDate, now);
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } catch {
        return 0;
      }
    });

  const overdue = payments.filter(p => {
    try {
      const dueDate = parseISO(p.dueDate);
      return !p.isPaid && isValid(dueDate) && isBefore(dueDate, now);
    } catch {
      return false;
    }
  });

  const thisWeek = payments.filter(p => {
    try {
      const dueDate = parseISO(p.dueDate);
      return !p.isPaid && isValid(dueDate) && isAfter(dueDate, now) && isBefore(dueDate, nextWeek);
    } catch {
      return false;
    }
  });

  const getPaymentStatus = (payment: FuturePayment) => {
    if (payment.isPaid) return { label: 'Paid', color: 'bg-green-100 text-green-700', priority: 0 };
    
    try {
      const dueDate = parseISO(payment.dueDate);
      if (!isValid(dueDate)) return { label: 'Invalid', color: 'bg-gray-100 text-gray-600', priority: 3 };
      
      if (isBefore(dueDate, now)) return { label: 'Overdue', color: 'bg-red-100 text-red-700', priority: 1 };
      if (isBefore(dueDate, nextWeek)) return { label: 'This Week', color: 'bg-orange-100 text-orange-700', priority: 2 };
      return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700', priority: 3 };
    } catch {
      return { label: 'Invalid', color: 'bg-gray-100 text-gray-600', priority: 3 };
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with Add Button - Properly contained */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-600">Payment Schedule</h3>
            <Badge variant="secondary" className="text-xs">
              {payments.length} total
            </Badge>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="h-7 px-3 text-xs"
            >
              <List className="w-3 h-3 mr-1" />
              List
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              onClick={() => setViewMode('calendar')}
              className="h-7 px-3 text-xs"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Calendar
            </Button>
          </div>
        </div>
        
        <AddFuturePaymentDialog
          onAddPayment={async (payment) => {
            await onAddPayment({
              ...payment,
              dueDate: payment.dueDate.toISOString(),
            });
          }}
          categories={categories.map(c => c.name)}
          trigger={
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-1" />
              Schedule
            </Button>
          }
        />
      </div>

      {/* Summary Stats - Contained within card */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-800">Total Due</span>
          </div>
          <p className="text-lg font-bold text-blue-900">${totalUpcoming.toLocaleString()}</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-medium text-orange-800">This Week</span>
          </div>
          <p className="text-lg font-bold text-orange-900">{thisWeek.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-red-800">Overdue</span>
          </div>
          <p className="text-lg font-bold text-red-900">{overdue.length}</p>
        </div>
      </div>

      {/* Content Area - List or Calendar View */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'calendar' ? (
          <FuturePaymentsCalendar 
            payments={payments}
            onPaymentClick={(payment) => {
              // Toggle payment status when clicked
              onUpdatePayment(payment.id, { isPaid: !payment.isPaid });
            }}
          />
        ) : (
          <ScrollArea className="h-full pr-2">
            <div className="space-y-3">
              {payments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">No payments scheduled</h3>
                  <p className="text-sm">Add upcoming bills and payments to stay organized</p>
                </div>
              ) : (
                payments
                  .sort((a, b) => {
                    const statusA = getPaymentStatus(a);
                    const statusB = getPaymentStatus(b);
                    if (statusA.priority !== statusB.priority) {
                      return statusA.priority - statusB.priority;
                    }
                    try {
                      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                    } catch {
                      return 0;
                    }
                  })
                  .map((payment) => {
                    const status = getPaymentStatus(payment);
                    return (
                      <div
                        key={payment.id}
                        className="group p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex-shrink-0">
                                <Badge
                                  className={`text-xs font-medium px-2 py-1 ${status.color}`}
                                  onClick={() => onUpdatePayment(payment.id, { isPaid: !payment.isPaid })}
                                >
                                  {status.label}
                                </Badge>
                              </div>
                              <h4 className="font-medium text-gray-900 truncate">
                                {payment.description}
                              </h4>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                <span>{formatDate(payment.dueDate, 'MMM dd')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                <span className="font-semibold text-gray-900">
                                  {payment.amount.toLocaleString()}
                                </span>
                              </div>
                              {payment.category && (
                                <Badge variant="outline" className="text-xs">
                                  {payment.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <Button
                              size="sm"
                              variant={payment.isPaid ? "secondary" : "default"}
                              onClick={() => onUpdatePayment(payment.id, { isPaid: !payment.isPaid })}
                              className={`transition-all ${
                                payment.isPaid
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-blue-600 hover:bg-blue-700 text-white"
                              }`}
                            >
                              {payment.isPaid ? "Paid" : "Mark Paid"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
