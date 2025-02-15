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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { es } from 'date-fns/locale';
import { format } from "date-fns";

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

const defaultPayments: FuturePayment[] = [
  {
    id: "1",
    description: "Rent Payment",
    amount: 1200,
    dueDate: new Date("2024-03-01"),
    category: "Housing",
    isPaid: false,
  },
  {
    id: "2",
    description: "Car Insurance",
    amount: 150,
    dueDate: new Date("2024-03-15"),
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Update the getLocale function
  const getLocale = (language: string) => {
    return language === 'es' ? es : undefined;
  };

  // Format date based on locale
  const formatDate = (date: Date) => {
    return format(date, 'PP', { locale: getLocale(i18n.language) });
  };

  // Calculate total upcoming payments
  const totalUpcoming = payments
    .filter((payment) => !payment.isPaid)
    .reduce((sum, payment) => sum + payment.amount, 0);

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
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={getLocale(i18n.language)}
              weekStartsOn={i18n.language === 'es' ? 1 : 0}
              className="rounded-md border"
              formatters={{
                formatWeekdayName: (date) => {
                  return format(date, 'EEEEE', { locale: getLocale(i18n.language) });
                },
                formatCaption: (date) => {
                  return format(date, 'LLLL yyyy', { locale: getLocale(i18n.language) });
                }
              }}
            />
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
