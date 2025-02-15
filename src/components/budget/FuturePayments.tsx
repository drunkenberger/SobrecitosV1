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
import { format, parseISO } from "date-fns";

interface FuturePayment {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  category: string;
  isPaid?: boolean;
}

interface FuturePaymentsProps {
  payments?: FuturePayment[];
  onPaymentUpdate?: (id: string, isPaid: boolean) => void;
  categories?: string[];
  onAddPayment: (payment: {
    description: string;
    amount: number;
    dueDate: Date;
    category: string;
  }) => void;
}

// Safely create dates
const createSafeDate = (dateString: string): Date => {
  try {
    return parseISO(dateString);
  } catch (error) {
    console.error('Error parsing date:', error);
    return new Date();
  }
};

const defaultPayments: FuturePayment[] = [
  {
    id: "1",
    description: "Rent Payment",
    amount: 1200,
    dueDate: createSafeDate("2024-03-01"),
    category: "Housing",
    isPaid: false,
  },
  {
    id: "2",
    description: "Car Insurance",
    amount: 150,
    dueDate: createSafeDate("2024-03-15"),
    category: "Insurance",
    isPaid: false,
  },
];

export default function FuturePayments({
  payments = defaultPayments,
  onPaymentUpdate = () => {},
  categories = [],
  onAddPayment,
}: FuturePaymentsProps) {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Initialize the selected date safely
  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  // Safe locale getter
  const getLocale = (language: string) => {
    try {
      return language === 'es' ? es : undefined;
    } catch (error) {
      console.error('Error getting locale:', error);
      return undefined;
    }
  };

  // Safe date formatter
  const formatDate = (date: Date) => {
    try {
      return format(date, 'PP', { locale: getLocale(i18n.language) });
    } catch (error) {
      console.error('Error formatting date:', error);
      return date.toLocaleDateString();
    }
  };

  // Calculate total upcoming payments safely
  const totalUpcoming = payments
    .filter((payment) => !payment.isPaid)
    .reduce((sum, payment) => sum + (typeof payment.amount === 'number' ? payment.amount : 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {t('dashboard.payments.calendar.title')}
        </h2>
        <AddFuturePaymentDialog
          onAddPayment={onAddPayment}
          categories={categories}
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
                onSelect={setSelectedDate}
                locale={getLocale(i18n.language)}
                weekStartsOn={i18n.language === 'es' ? 1 : 0}
                className="rounded-md border"
                formatters={{
                  formatWeekdayName: (date) => {
                    try {
                      return format(date, 'EEEEE', { locale: getLocale(i18n.language) });
                    } catch (error) {
                      return format(date, 'EEEEE');
                    }
                  },
                  formatCaption: (date) => {
                    try {
                      return format(date, 'LLLL yyyy', { locale: getLocale(i18n.language) });
                    } catch (error) {
                      return format(date, 'LLLL yyyy');
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
                  .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
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
                            onPaymentUpdate(payment.id, !payment.isPaid)
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
