import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronLeft, ChevronRight, Calendar, DollarSign } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isValid } from "date-fns";

interface FuturePayment {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid?: boolean;
}

interface FuturePaymentsCalendarProps {
  payments: FuturePayment[];
  onPaymentClick?: (payment: FuturePayment) => void;
}

export function FuturePaymentsCalendar({ 
  payments, 
  onPaymentClick 
}: FuturePaymentsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get payments for the current month
  const monthPayments = payments.filter(payment => {
    try {
      const paymentDate = parseISO(payment.dueDate);
      return isValid(paymentDate) && isSameMonth(paymentDate, currentMonth);
    } catch {
      return false;
    }
  });

  // Group payments by date
  const paymentsByDate = monthPayments.reduce((acc, payment) => {
    try {
      const paymentDate = parseISO(payment.dueDate);
      if (isValid(paymentDate)) {
        const dateKey = format(paymentDate, 'yyyy-MM-dd');
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(payment);
      }
    } catch {
      // Ignore invalid dates
    }
    return acc;
  }, {} as Record<string, FuturePayment[]>);

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const getPaymentStatusColor = (payment: FuturePayment, date: Date) => {
    const today = new Date();
    const paymentDate = parseISO(payment.dueDate);
    
    if (payment.isPaid) {
      return "bg-green-100 text-green-700 border-green-200";
    } else if (paymentDate < today) {
      return "bg-red-100 text-red-700 border-red-200";
    } else if (paymentDate.getTime() - today.getTime() <= 7 * 24 * 60 * 60 * 1000) {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const getDayPayments = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return paymentsByDate[dateKey] || [];
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToCurrentMonth}
            className="text-xs"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month start */}
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="h-24 p-1">
              <div className="w-full h-full rounded border border-transparent"></div>
            </div>
          ))}

          {/* Month days */}
          {monthDays.map(date => {
            const dayPayments = getDayPayments(date);
            const isToday = isSameDay(date, new Date());
            
            return (
              <div key={format(date, 'yyyy-MM-dd')} className="h-24 p-1">
                <div className={`
                  w-full h-full rounded border border-gray-100 p-1 relative overflow-hidden
                  ${isToday ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50' : 'hover:bg-gray-50'}
                  ${dayPayments.length > 0 ? 'border-blue-200' : ''}
                `}>
                  {/* Date number */}
                  <div className={`
                    text-xs font-medium mb-1
                    ${isToday ? 'text-blue-700' : 'text-gray-700'}
                  `}>
                    {format(date, 'd')}
                  </div>

                  {/* Payments for this day */}
                  <div className="space-y-0.5">
                    {dayPayments.slice(0, 2).map(payment => (
                      <div
                        key={payment.id}
                        onClick={() => onPaymentClick?.(payment)}
                        className={`
                          text-xs px-1.5 py-0.5 rounded border cursor-pointer
                          hover:shadow-md hover:scale-105 hover:z-10 relative transition-all text-center
                          ${getPaymentStatusColor(payment, date)}
                        `}
                        title={`${payment.description} - $${payment.amount.toLocaleString()}${payment.isPaid ? ' (Paid)' : ''}
Category: ${payment.category}
Click to mark as ${payment.isPaid ? 'unpaid' : 'paid'}`}
                      >
                        <div className="truncate font-medium">
                          {payment.description}
                        </div>
                        <div className="flex items-center justify-center gap-0.5">
                          <DollarSign className="w-2.5 h-2.5" />
                          <span className="font-semibold">
                            {payment.amount.toLocaleString()}
                          </span>
                        </div>
                        {payment.isPaid && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Show "+X more" if there are more than 2 payments */}
                    {dayPayments.length > 2 && (
                      <div 
                        className="text-xs text-center text-gray-500 bg-gray-100 hover:bg-gray-200 rounded px-1 py-0.5 cursor-pointer transition-colors"
                        title={`${dayPayments.length - 2} more payments:
${dayPayments.slice(2).map(p => `• ${p.description} - $${p.amount.toLocaleString()}`).join('\n')}`}
                      >
                        +{dayPayments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
            <span className="text-gray-600">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-100 border border-orange-200"></div>
            <span className="text-gray-600">Due Soon (7 days)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
            <span className="text-gray-600">Overdue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
            <span className="text-gray-600">Paid</span>
          </div>
        </div>
      </div>
    </div>
  );
}