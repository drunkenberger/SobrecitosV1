import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddFuturePaymentDialog } from "./AddFuturePaymentDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { es } from 'date-fns/locale';
import { format, parseISO, isValid } from "date-fns";
import type { Category } from "@/lib/store";

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

// Safely create dates with validation
const createSafeDate = (dateString: string): Date => {
  try {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? parsedDate : new Date();
  } catch (error) {
    console.error('Error parsing date:', error);
    return new Date();
  }
};

export default function FuturePayments({
  payments = [],
  categories = [],
  onAddPayment,
  onUpdatePayment,
}: FuturePaymentsProps) {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // Initialize the selected date safely
  useEffect(() => {
    try {
      const now = new Date();
      if (isValid(now)) {
        setSelectedDate(now);
      }
    } catch (error) {
      console.error('Error initializing date:', error);
      setError('Error initializing calendar');
    }
  }, []);

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
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        throw new Error('Invalid date');
      }
      return format(date, 'PP', { locale: getLocale(i18n.language) });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Calculate total upcoming payments safely
  const totalUpcoming = payments
    .filter((payment) => !payment.isPaid && payment.amount && typeof payment.amount === 'number')
    .reduce((sum, payment) => sum + payment.amount, 0);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {t('dashboard.payments.calendar.title')}
        </h2>
        <AddFuturePaymentDialog
          onAddPayment={async (payment) => {
            await onAddPayment({
              ...payment,
              dueDate: payment.dueDate.toISOString(),
            });
          }}
          categories={categories.map(c => c.name)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.payments.calendar.upcomingTitle')}</CardTitle>
            <CardDescription>
              {t('dashboard.payments.calendar.totalUpcoming')}: ${totalUpcoming.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDate && (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  try {
                    if (date && isValid(date)) {
                      setSelectedDate(date);
                    }
                  } catch (error) {
                    console.error('Error selecting date:', error);
                  }
                }}
                locale={getLocale(i18n.language)}
                weekStartsOn={i18n.language === 'es' ? 1 : 0}
                className="rounded-md border"
                formatters={{
                  formatWeekdayName: (date) => {
                    try {
                      if (!isValid(date)) return '';
                      return format(date, 'EEEEE', { locale: getLocale(i18n.language) });
                    } catch (error) {
                      return '';
                    }
                  },
                  formatCaption: (date) => {
                    try {
                      if (!isValid(date)) return '';
                      return format(date, 'LLLL yyyy', { locale: getLocale(i18n.language) });
                    } catch (error) {
                      return '';
                    }
                  }
                }}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.payments.calendar.scheduledPayments')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboard.payments.calendar.tableHeaders.description')}</TableHead>
                  <TableHead>{t('dashboard.payments.calendar.tableHeaders.dueDate')}</TableHead>
                  <TableHead>{t('dashboard.payments.calendar.tableHeaders.amount')}</TableHead>
                  <TableHead>{t('dashboard.payments.calendar.tableHeaders.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments
                  .sort((a, b) => {
                    try {
                      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                    } catch (error) {
                      return 0;
                    }
                  })
                  .map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>{formatDate(payment.dueDate)}</TableCell>
                      <TableCell>${payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={payment.isPaid ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() =>
                            onUpdatePayment(payment.id, { isPaid: !payment.isPaid })
                          }
                        >
                          {payment.isPaid 
                            ? t('dashboard.payments.calendar.status.paid')
                            : t('dashboard.payments.calendar.status.pending')
                          }
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
